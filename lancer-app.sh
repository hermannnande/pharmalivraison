#!/bin/bash

echo "================================"
echo " PHARMALIVRAISON ABIDJAN"
echo " Lancement avec Docker"
echo "================================"
echo ""

echo "[1/5] Arrêt des conteneurs existants..."
docker-compose down

echo ""
echo "[2/5] Construction des images Docker..."
docker-compose build

echo ""
echo "[3/5] Démarrage de MongoDB et du Backend..."
docker-compose up -d

echo ""
echo "[4/5] Attente du démarrage des services (15 secondes)..."
sleep 15

echo ""
echo "[5/5] Création des données de test..."
docker-compose exec backend npm run seed

echo ""
echo "================================"
echo " SERVICES DÉMARRÉS !"
echo "================================"
echo ""
echo " Backend API  : http://localhost:5000"
echo " MongoDB      : mongodb://localhost:27017"
echo ""
echo " Comptes de test :"
echo " - Client   : 0707070707 / test123"
echo " - Livreur  : 0708080808 / test123"
echo " - Pharmacie: 0702020202 / test123"
echo ""
echo " Pour voir les logs :"
echo "   docker-compose logs -f"
echo ""
echo " Pour arrêter :"
echo "   docker-compose down"
echo ""
echo "================================"








