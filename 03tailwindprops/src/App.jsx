import './App.css'

function App() {
  
  return (
    <>
      <h1 className='bg-green-400 p-10 rounded-xl'>We are learning Tailwind CSS!</h1>

      <figure className="bg-gray-100 rounded-xl p-8">
        <img className="w-32 h-32 rounded-full mx-auto" src="https://images.pexels.com/photos/39325103/pexels-photo-39325103.jpeg?_gl=1*fxbui1*_ga*MTA0Njg5OTA0Ny4xNzg2Mjc5MDQ3*_ga_8JE65Q40S6*czE3ODk5NjY4ODgkbzIkZzEkdDE3ODk5NjY5MDQkajQ0JGwwJGgw" alt="" width="384" height="512" />
        <div className="pt-6 space-y-4">
          <blockquote>
            <p className="text-lg font-semibold">
              "Tailwind CSS is the only framework that I've seen scale
              on large teams. It's easy to customize, adapts to any design,
              and the build size is tiny."
            </p>
          </blockquote>
          <figcaption className="font-medium">
            <div className="text-cyan-600">
              Sarah Dayan
            </div>
            <div>
              Staff Engineer, Algolia
            </div>
          </figcaption>
        </div>
      </figure>
    </>
  )
}

export default App