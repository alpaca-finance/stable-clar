;; title: position-storage-trait
;; description: A trait defines functions of position storage contract

(define-trait position-storage-trait
  (
    (set-position-status (principal uint) (response bool uint))
    (increase-collateral (principal uint) (response bool uint))
    (increase-debt (principal uint) (response bool uint))
  )
)