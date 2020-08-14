import React, { useState, useReducer, useEffect, } from 'react';
import {
  Container,
  Grid,
  CircularProgress,
  TextField,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import './App.css';
import CardItem from './components/CardItem';

const io = require('socket.io-client');
const socket = io('http://localhost:3001');

const useStyles = makeStyles((theme) => ({
  center: {
    textAlign: 'center',
  },
  input: {
    minWidth: '250px',
  },
  button: {
    marginTop: '12px',
  },
}));

const initialState = {
  events: [],
};

const App = () => {
  const reducer = (state, action) => {
    return {
      events: [action.event, ...state.events].slice(0, 10)
    };
  }
  const [state, dispatch] = useReducer(reducer, initialState);

  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const classes = useStyles();
  const events = state.events || [];

  useEffect(() => {
    socket.on('connect', () => {
      socket.on('tweets', payload => {
        dispatch({
          event: payload
        });
      });
    });

    socket.on('disconnect', () => {
      socket.off('tweets');
      socket.removeAllListeners('tweets');
    });
  }, []);

  const handleSubmit = e => {
    e.preventDefault();

    setIsLoading(true);
    setKeyword(e.target.elements.keyword.value);

    fetch(`http://localhost:3001/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ keyword })
    }).then(() => setIsLoading(false));
  };

  return (
    <div className="App">
      <Container maxWidth="sm">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <form
              className={classes.center}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <TextField
                required
                label="Search for a keyword"
                name="keyword"
                defaultValue=""
                className={classes.input}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Search
              </Button>
            </form>
          </Grid>

          <Grid item xs={12}>
            {isLoading &&
              <div className={classes.center}>
                <CircularProgress />
              </div>
            }
            {!isLoading && events.length > 0 &&
              <React.Fragment>
                {events.map((item, i) => (
                  <CardItem data={item} key={i} />
                ))}
              </React.Fragment>
            }
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default App;
