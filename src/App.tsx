import FranceMap from './components/FranceMap';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">
        La bouffe en france
      </h1>
      <div className="w-full max-w-4xl px-4">
        <FranceMap />
      </div>
      <footer className="mt-12 text-gray-500 font-medium">
        Créé avec ❤️ par SamLePirate
      </footer>
    </div>
  )
}

export default App
