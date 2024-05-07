
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
(define-constant ERR_INVALID_POSITION (err u401))
(define-constant ERR_FORBIDDEN (err u403))
(define-constant ERR_NOT_INITIALIZED (err u501))

;; data vars
;;
(define-data-var owner principal tx-sender)
(define-data-var position-storage principal tx-sender)
(define-data-var oracle principal tx-sender)
(define-data-var collateral principal tx-sender)

(define-data-var is-initialized bool false)

;; data maps
;;

;; initialize function
(define-public (initialize
  (init-oracle principal)
  (init-position-storage principal)
  (init-collateral principal)
  )
  (begin
    ;; #[allow(unchecked_data)]
    (var-set oracle init-oracle)
    ;; #[allow(unchecked_data)]
    (var-set position-storage init-position-storage)
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
      position-storage: (var-get position-storage),
      collateral: (var-get collateral)
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


