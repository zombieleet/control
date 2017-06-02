const { printf } = require('../control');

const obj = {
    firstname:"victory",
    lastname: "osikwemhe",
    country: "nigeria",
    age: 21,
    hobbies: {
        sport: ["soccer","basketball"],
        singing: ["blues"],
        movies: ["action", "war", "horror", "scific"]
    },
    occupation: ["student"]
};

printf("%.4jn %.2ob %.3ar", JSON.stringify(obj),obj,["sleepy Hollow","The walking dead", "silicon valley", "vikings", "sense8"]);
