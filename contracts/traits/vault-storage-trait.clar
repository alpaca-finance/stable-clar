;; title: vault-storage-trait
;; description: A trait defines functions of vault storage contract

(define-trait vault-storage-trait
  (
    (set-vault-status (principal uint) (response bool uint))
    (increase-collateral (principal uint) (response bool uint))
    (increase-debt (principal uint) (response bool uint))
  )
)