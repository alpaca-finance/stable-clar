;; title: simple_oracle
;; version: 0.0.1
;; summary: Simple oracle contract
;; description: A plain simple oracle contract that 
;; allows whitelisted accounts to set asset prices and return asset prices

;; traits
;;
(impl-trait .oracle-trait.oracle-trait)
(impl-trait .ownable-trait.ownable-trait)
(use-trait ft .ft-trait.ft-trait)

;; token definitions
;;

;; constants
;;
(define-constant ERR_FORBIDDEN (err u403))
(define-constant ERR_NOT_FOUND (err u404))

;; data vars
;;
(define-data-var feeder principal tx-sender)
(define-data-var owner principal tx-sender)

;; data maps
;;
(define-map assets principal uint)

;; public functions
;;
(define-public (set-price
  (asset <ft>)
  (price uint)
  )
  ;; #[allow(unchecked_data)]
  (ok (map-set assets (contract-of asset) price))
)

;; read only functions
;;
(define-read-only (get-asset-price
  (asset <ft>)
  )
  (match (map-get? assets (contract-of asset))
    ret (ok ret)
    ERR_NOT_FOUND
  )
)

(define-read-only (get-owner
  )
  (ok (var-get owner))
)

;; admin only functions
;;
(define-public (set-feeder
  (new-feeder principal)
  )
  (begin
    (try! (asset-is-owner))
    ;; #[allow(unchecked_data)]
    (var-set feeder new-feeder)
    (ok true)
  )
)

(define-public (transfer-ownership
  (new-owner principal)
  )
  (begin
    (try! (asset-is-owner))
    ;; #[allow(unchecked_data)]
    (var-set owner new-owner)
    (ok true)
  )
)

;; private functions
;;
(define-private (asset-is-owner)
  (ok (asserts! (is-eq (var-get owner) tx-sender) ERR_FORBIDDEN))
)