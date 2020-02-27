var imdb = require("imdb-node-api");

imdb.search(
  { searchKey: "Beauty.And.The.Beast.2017", maxResult: 1 },
  (e, d) => {
    let { result } = JSON.parse(d);
    let film_ = result[0];
    imdb.getByImdbId(film_.imdbId, function(err, data) {
      let film = JSON.parse(data).result;
      film.title = film_.name;
      console.log(film);
    });
  }
);
