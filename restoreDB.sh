source .env

docker compose exec -T dbAuth mysql -u${DB_USER} -p${DB_PASS} $DB_NAME < ./restful_db.sql
