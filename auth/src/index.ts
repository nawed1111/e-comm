import { app } from './app';

//connect to the database
import './helpers/initialize/init-mongodb';

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
