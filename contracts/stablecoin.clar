;; title: stablecoin
;; version:
;; summary:
;; description:

;; traits
;;
(impl-trait .ft-trait.ft-trait)
(impl-trait .stablecoin-trait.stablecoin-trait)

;; token definitions
;;
(define-fungible-token stablecoin)

;; constants
;;
(define-constant deployer-principal tx-sender)

;; errors
;;
(define-constant ERR_INITIALIZED (err u4001))
(define-constant ERR_FORBIDDEN (err u4002))

;; data vars
;;
(define-data-var token-uri (optional (string-utf8 256)) none)

;; data maps
;;
(define-map minters principal bool)

;; public functions
;;
(define-public (transfer (amount uint) (from principal) (to principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq from tx-sender) ERR_FORBIDDEN)
    ;; #[allow(unchecked_data)]
    (match (ft-transfer? stablecoin amount from to)
      response (begin
        (print memo)
        (ok response)
      )
      error (err error)
    )
  )
)

(define-public (mint
  (to principal)
  (amount uint)
  )
  (begin
    (asserts! (default-to false (map-get? minters contract-caller)) ERR_FORBIDDEN)
    ;; #[allow(unchecked_data)]
    (try! (ft-mint? stablecoin amount to))
    (ok true)
  )
)

;; read only functions
;;
(define-read-only (get-name) (ok "stablecoin"))

(define-read-only (get-symbol) (ok "USD"))

(define-read-only (get-decimals) (ok u8))

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance stablecoin who))
)

(define-read-only (get-total-supply) (ok (ft-get-supply stablecoin)))

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

;; admin functions
;;
(define-public (set-token-uri (value (string-utf8 256)))
  (if (is-eq tx-sender deployer-principal)
    ;; #[allow(unchecked_data)]
    (ok (var-set token-uri (some value)))
    ERR_FORBIDDEN
  )
)

(define-public (set-minter
  (minter principal)
  (status bool)
  )
  (begin
    (asserts! (is-eq tx-sender deployer-principal) ERR_FORBIDDEN)
    ;; #[allow(unchecked_data)]
    (map-set minters minter status)
    (ok true)
  )
)
