import Carousel from '../Components/Carousel'
<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
function Home(){
    return(
        <div className="bg-gray-400 min-h-screen max-h-full">
            <div className="flex text-2xl justify-center py-5">
                <p>Welcome to ProtoSite! Where I just do a bunch of random stuff to get better knowledge of web developing! (In React, Node and Tailwind) </p>
            </div>
            <Carousel/>
        </div>
    )
}

export default Home;