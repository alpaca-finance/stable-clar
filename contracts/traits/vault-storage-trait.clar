;; title: vault-storage-trait
;; description: A trait defines functions of vault storage contract

;; (cumulate-balance
;;       (principal)
;;       (response (tuple
;;         (previous-user-balance uint)
;;         (current-balance uint)
;;         (balance-increase uint)
;;         (index uint))
;;         uint))
(define-trait vault-storage-trait
  (
    (set-vault-status (principal uint) (response bool uint))
    (increase-collateral (principal uint) (response bool uint))
    (increase-debt (principal uint) (response bool uint))
    (get-vault
      (principal)
      (response 
        (tuple
          (debt uint)
          (collateral uint)
          (status uint)
          (arrayIndex uint)
        )
        uint
      )
    )
  )
)