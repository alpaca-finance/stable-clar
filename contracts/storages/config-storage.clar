
;; title: config-storge.clar
;; version:
;; summary: config storage contract
;; description:

;; traits
;;
(impl-trait .ownable-trait.ownable-trait)

;; token definitions
;;

;; constants
;;
(define-constant ERR_FORBIDDEN (err u3001))
(define-constant ERR_NOT_INITIALIZED (err u3002))

;; data vars
;;
(define-data-var owner principal tx-sender)
(define-data-var vault-storage principal tx-sender)
(define-data-var oracle principal tx-sender)
(define-data-var collateral principal tx-sender)
(define-data-var min-debt uint u100000000000)

(define-data-var is-initialized bool false)

;; data maps
;;

;; initialize function
(define-public (initialize
  (init-oracle principal)
  (init-vault-storage principal)
  (init-collateral principal)
  )
  (begin
    ;; #[allow(unchecked_data)]
    (var-set oracle init-oracle)
    ;; #[allow(unchecked_data)]
    (var-set vault-storage init-vault-storage)
    ;; #[allow(unchecked_data)]
    (var-set collateral init-collateral)
    (var-set is-initialized true)
    (ok true)
  )
)


;; public functions
;;



;; read only functions
;;
(define-read-only (get-owner)
  (ok (var-get owner))
)

(define-read-only (get-configurations)
  (begin 
    (asserts! (var-get is-initialized) ERR_NOT_INITIALIZED)
    (ok {
      oracle: (var-get oracle),
      vault-storage: (var-get vault-storage),
      collateral: (var-get collateral),
      min-debt: (var-get min-debt)
    })
  )
)

;; admin only functions
;;
(define-public (set-oracle
  (new-oracle principal)
  )
  (begin
    (try! (assert-is-owner))
    ;; #[allow(unchecked_data)]
    (var-set oracle new-oracle)
    (ok true)
  )
)

(define-public (set-vault-storage
  (new-vault-storage principal)
  )
  (begin
    (try! (assert-is-owner))
    ;; #[allow(unchecked_data)]
    (var-set vault-storage new-vault-storage)
    (ok true)
  )
)

(define-public (set-min-debt
  (new-min-debt uint)
  )
  (begin
    (try! (assert-is-owner))
    ;; #[allow(unchecked_data)]
    (var-set min-debt new-min-debt)
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


