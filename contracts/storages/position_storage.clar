
;; title: position-storge.clar
;; version:
;; summary: position storage contract
;; description:

;; traits
;;
(impl-trait .ownable-trait.ownable-trait)

;; token definitions
;;

;; constants
;;
(define-constant ERR_INVALID_POSITION (err u401))
(define-constant ERR_FORBIDDEN (err u403))

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
(define-map positions principal 
  {
    debt: uint,
    collateral: uint,
    status: uint,
    arrayIndex: uint
  }
)

;; public functions
;;
(define-public (set-position-status
  (borrower principal)
  (status uint)
  )
  (let
    (
      (pos (unwrap! (get-position borrower) ERR_INVALID_POSITION))
      (data { debt: (get debt pos), collateral: (get collateral pos), status: status, arrayIndex: (get arrayIndex pos) })
    )
    (try! (assert-is-allowed-caller contract-caller))
    ;; #[allow(unchecked_data)]
    (map-set positions borrower data)
    (ok true)
  )
)



;; read only functions
;;
(define-read-only (get-owner)
  (ok (var-get owner))
)

(define-read-only (get-position
  (borrower principal)
  )
  (ok (default-to { debt: u0, collateral: u0, status: u0, arrayIndex: u0 } (map-get? positions borrower))
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


