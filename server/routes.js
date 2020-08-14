const Twitter = require('twitter');

module.exports = (app, io) => {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  let connection;
  let keyword = '';

  /**
   * Socket connection.
   */
  io.on('connection', socket => {
    connection = socket;

    stream();

    socket.on('connection', () => console.log('Client connected'));
    socket.on('disconnect', () => console.log('Client disconnected'));
  });

  /**
   * Twitter Streaming.
   */
  const stream = () => {
    client.stream('statuses/filter', {track: keyword}, stream => {
      stream.on('data', event => {
        if (event.text.includes('RT')) {
          return;
        }
        connection.emit('tweets', event);
      });

      stream.on('error', error => {
        console.log(error);
      });
    });
  };

  /**
   * Search on twitter stream.
   */
  app.post('/search', (req, res) => {
    keyword = req.body.keyword;

    stream();

    res.json({ success: true });
  });
};
