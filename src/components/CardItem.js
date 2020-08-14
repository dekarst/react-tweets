import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Avatar,
  Typography,
} from '@material-ui/core';

const CardItem = ({ data, }) => (
  <Card variant="outlined">
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Avatar
            src={data.user.profile_image_url}
            alt={data.user.name}
          />
        </Grid>
        <Grid item xs={10}>
          <Typography gutterBottom variant="h6" component="h2">
            {data.user.name}
          </Typography>
          <a
            href={`https://twitter.com/${data.user.screen_name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`@${data.user.screen_name}`}
          </a>
          <Typography variant="body2" color="textSecondary" component="p">
            {data.text}
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default CardItem;
