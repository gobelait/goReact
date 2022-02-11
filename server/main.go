package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gobelait/goReact/db"
	"github.com/gobelait/goReact/router"

	"github.com/joho/godotenv"
)

func main() {
	loadTheEnv()
	db.ConnectMongodb()
	r := router.Router()
	srv := &http.Server{
		Addr:    ":9000",
		Handler: corsHandler(r),
	}
	fmt.Println("Starting the server on port 9000..")
	log.Fatal(srv.ListenAndServe())
}

func loadTheEnv() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Erreur au chargement du fichier .env")
	}
}

func corsHandler(h http.Handler) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {
		allowedHeaders := "Accept, Content-Type, Content-Length, Accept-Encoding"
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", allowedHeaders)
		w.Header().Set("Access-Control-Expose-Headers", "Authorization")

		if r.Method != "OPTIONS" {
			h.ServeHTTP(w, r)
		}
	}
}
