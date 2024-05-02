
;; title: sbtc
;; version:
;; summary:
;; description:

;; traits
;;
(impl-trait .ft-trait.ft-trait)

;; token definitions
;;
(define-fungible-token sbtc)

;; constants
;;
(define-constant ERR_FORBIDDEN (err u403))

;; data vars
;;
(define-data-var token-name (string-ascii 32) "sbtc")
(define-data-var token-symbol (string-ascii 8) "sBTC")
(define-data-var token-uri (optional (string-utf8 256)) none)
(define-data-var token-decimals uint u8)

;; data maps
;;

;; public functions
;;
(define-public (transfer
  (amount uint)
  (sender principal)
  (recipient principal)
  (memo (optional (buff 34)))
  )
  (begin
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) ERR_FORBIDDEN)
    ;; #[allow(unchecked_data)]
    (ft-transfer? sbtc amount sender recipient)
  )
)

(define-public (mint
  (amount uint)
  (recipient principal)
  )
  (begin
    ;; #[allow(unchecked_data)]
    (ft-mint? sbtc amount recipient)
  )
)

;; read only functions
;;
(define-read-only (get-name)
  (ok (var-get token-name))
)

(define-read-only (get-symbol)
  (ok (var-get token-symbol))
)

(define-read-only (get-decimals)
  (ok (var-get token-decimals))
)

(define-read-only (get-balance
  (account principal)
  )
  (ok (ft-get-balance sbtc account))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply sbtc))
)

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

;; private functions
;;

