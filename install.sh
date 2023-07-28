
echo "Backend"
cd ./backend
echo "> npm install"
npm install
echo "> npm run recbuild"
npm run build
cd ..

echo "Frontend"
cd ./frontend
echo "> npm install"
npm install
echo "> npm run recbuild"
npm run build

cd ..