import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"


const Home = () => {
  const addToCardHandler = ()=>{

  }
  return (
    <div className="home">
      <section>

      </section>
      <h1>
        Latest Products
        <Link to={"/search"} className="findmore">
          More
        </Link>
      </h1>
      <main>
        <ProductCard 
          productId="sdffadfafd"
          name="Macbook"
          price={78000}
          stock={2}
          handler={addToCardHandler}
          photo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQdNHQOEyKz9wiuDof_a28hQ5dB02UhIZptg&s"
        />
      </main>
    </div>
  )
}

export default Home