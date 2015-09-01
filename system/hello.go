package main

import "fmt"
import "database/sql"
import _ "github.com/go-sql-driver/mysql"
import "time"

func main() {
  db, err := sql.Open("mysql", "root:@/printbox_dev?charset=utf8mb4,utf8&parseTime=true")
  checkErr(err)

  defer db.Close()

  // Open doesn't open a connection. Validate DSN data:
  err = db.Ping()
  checkErr(err)

  // query
  rows, err := db.Query("SELECT * FROM Events")
  checkErr(err)

  for rows.Next() {
    var id int
    var eventType string
    var timeStamp time.Time
    var data string
    var createdAt time.Time
    var updatedAt time.Time

    err = rows.Scan(&id, &eventType, &timeStamp, &data, &createdAt, &updatedAt)
    checkErr(err)

    fmt.Println(id)
  }
}

func checkErr(err error) {
  if err != nil {
    panic(err)
  }
}
