function ThanksSpotify() {
    return (
        <div className="bg-gray-400 min-h-screen">
            <p className="text-black text-4xl/[1.5] mx-[25%]">Unfortunately, Spotify now requires the use of their Web Playback SDK in order to preview audio from songs.
                This means all users have to have an OFFICIAL spotify application installed on their desktop/mobile, then have to sign-in on both the web application
                and official application, then have to link the web application as a potential spotify instance, to which they can then use spotify within the web application.
                I'm not sure why they felt the need to remove 30 second audio clips from 2-3 minute songs, but they did.
            </p>
        </div>
    )
}

export default ThanksSpotify;