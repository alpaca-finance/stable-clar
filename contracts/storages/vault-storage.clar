
;; title: vault-storge.clar
;; version:
;; summary: vault storage contract
;; description:

;; traits
;;
(impl-trait .ownable-trait.ownable-trait)
(impl-trait .vault-storage-trait.vault-storage-trait)

;; token definitions
;;

;; constants
;;
(define-constant ERR_INVALID_VAULT (err u2001))
(define-constant ERR_FORBIDDEN (err u2002))

;; data vars
;;
(define-data-var owner principal tx-sender)

;; data maps
;;
(define-map allow-callers principal bool)
;; status:
;; 0: Not existed
;; 1: Active
;; 2: Closed by owner
;; 3: Closed by liquidation
;; 4: Closed by redemption
(define-map vaults principal 
  {
    debt: uint,
    collateral: uint,
    status: uint,
    arrayIndex: uint
  }
)

;; public functions
;;
(define-public (set-vault-status
  (borrower principal)
  (status uint)
  )
  (let
    (
      (pos (unwrap! (get-vault borrower) ERR_INVALID_VAULT))
      (data { debt: (get debt pos), collateral: (get collateral pos), status: status, arrayIndex: (get arrayIndex pos) })
    )
    (try! (assert-is-allowed-caller contract-caller))
    ;; #[allow(unchecked_data)]
    (map-set vaults borrower data)
    (ok true)
  )
)

(define-public (increase-collateral
  (who principal)
  (amount uint)
  )
  (let
    (
      (pos (unwrap! (get-vault who) ERR_INVALID_VAULT))
      (data { debt: (get debt pos), collateral: (+ (get collateral pos) amount), status: (get status pos), arrayIndex: (get arrayIndex pos) })
    )
    (try! (assert-is-allowed-caller contract-caller))
    ;; #[allow(unchecked_data)]
    (map-set vaults who data)
    (ok true)
  )
)

(define-public (increase-debt
  (who principal)
  (amount uint)
  )
  (let
    (
      (pos (unwrap! (get-vault who) ERR_INVALID_VAULT))
      (data { debt: (+ (get debt pos) amount), collateral: (get collateral pos), status: (get status pos), arrayIndex: (get arrayIndex pos) })
    )
    (try! (assert-is-allowed-caller contract-caller))
    ;; #[allow(unchecked_data)]
    (map-set vaults who data)
    (ok true)
  )
)


;; read only functions
;;
(define-read-only (get-owner)
  (ok (var-get owner))
)

(define-read-only (get-vault
  (borrower principal)
  )
  (ok (default-to { debt: u0, collateral: u0, status: u0, arrayIndex: u0 } (map-get? vaults borrower))
  )
)

(define-read-only (is-allow-caller
  (caller principal)
  )
  (ok (default-to false (map-get? allow-callers caller))
  )
)

;; admin only functions
;;
(define-public (set-allow-caller
  (caller principal)
  (is-allow bool)
  )
  (begin
    (try! (assert-is-owner))
    ;; #[allow(unchecked_data)]
    (map-set allow-callers caller is-allow)
    (ok true)
  )
)

(define-public (transfer-ownership
  (new-owner principal)
  )
  (begin
    (try! (assert-is-owner))
    ;; #[allow(unchecked_data)]
    (var-set owner new-owner)
    (ok true)
  )
)

;; private functions
;;
(define-private (assert-is-owner)
  (ok (asserts! (is-eq (var-get owner) tx-sender) ERR_FORBIDDEN))
)

(define-private (assert-is-allowed-caller
  (caller principal)
  )
  (ok (asserts! (is-eq (default-to false (map-get? allow-callers caller)) true) ERR_FORBIDDEN))
)


