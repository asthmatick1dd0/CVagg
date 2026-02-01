package cvaggtx

import "gorm.io/gorm"

var dbtx *gorm.DB

func New(db *gorm.DB) {
	dbtx = db
}

func BeginTransaction() (*gorm.DB, error) {
	tx := dbtx.Begin()
	if tx.Error != nil {
		return nil, tx.Error
	}
	return tx, nil
}

func CommitTransaction(tx *gorm.DB) error {
	return tx.Commit().Error
}

func RollbackTransaction(tx *gorm.DB) error {
	return tx.Rollback().Error
}
