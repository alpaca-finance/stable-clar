
;; title: usr_entry
;; version:
;; summary:
;; description:

;; traits
;;
(use-trait oracle-trait .oracle-trait.oracle-trait)
(use-trait position-storage-trait .position-storage-trait.position-storage-trait)
(use-trait ft .ft-trait.ft-trait)

;; token definitions
;;

;; constants
;;
(define-constant ERR_BAD_ORACLE (err u401))
(define-constant ERR_BAD_POSITION_STORAGE (err u402))
(define-constant ERR_BAD_COLLATERAL (err u403))
(define-constant ERR_GET_CONFIGS (err u501))

;; data vars
;;

;; data maps
;;

;; public functions
;;
(define-public (new-position
  (oracle <oracle-trait>)
  (position-storage <position-storage-trait>)
  (collateral <ft>)
  (collateral-amount uint)
  (stable-coin-amount uint)
  )
  (let
    (
      (configs (unwrap! (contract-call? .config-storage get-configurations) ERR_GET_CONFIGS))
    )
    (asserts! (is-eq (contract-of oracle) (get oracle configs)) ERR_BAD_ORACLE)
    (asserts! (is-eq (contract-of position-storage) (get position-storage configs)) ERR_BAD_POSITION_STORAGE)
    (asserts! (is-eq (contract-of collateral) (get collateral configs)) ERR_BAD_COLLATERAL)
    (let
      (
        (price (try! (contract-call? oracle fetch-price collateral)))
      )
      ;; set position status
      (try! (contract-call? position-storage set-position-status tx-sender u1))
      ;; increase collateral
      (try! (contract-call? position-storage increase-collateral tx-sender collateral-amount))
      ;; increase debt
      (try! (contract-call? position-storage increase-debt tx-sender stable-coin-amount))
    )
    (ok true)
  )
)

;; read only functions
;;

;; private functions
;;

