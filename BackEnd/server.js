import express from "express";
import mysql from "mysql";
import moment from 'moment-timezone';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();


// Set the default time zone to Riyadh (Arabian Standard Time) -- problem with the data between database and front end
moment.tz.setDefault('Asia/Riyadh');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});
const privateKey = process.env.PRIVATE_KEY;

app.get("/", (req, res) => {
    res.json("hellooo!!");
});

// Sign up endpoint 
app.post("/signup", async (req, res) => {
    const q = "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const values = [
        req.body.userName,
        req.body.email,
        hashedPassword
    ];
    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json("A User Has Been Added!");
    });
});

// Sign in endpoint 
app.post('/signin', async (req, res) => {
    const q = 'SELECT * FROM users WHERE email = ?';
    const values = [req.body.email];

    db.query(q, values, async (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (data.length > 0) {
            // User found - compare hashed password
            const storedHashedPassword = data[0].password;

            try {
                const passwordMatch = await bcrypt.compare(req.body.password, storedHashedPassword);

                if (passwordMatch) {
                    // Passwords match - user is authenticated
                    const username = data[0].username;
                    const token = jwt.sign({ username }, privateKey, { expiresIn: '10m' });
                    return res.status(200).json({ message: 'Sign In Successful', token: token });
                } else {
                    // Passwords don't match
                    return res.status(401).json({ message: 'Invalid email or password' });
                }
            } catch (compareError) {
                console.error(compareError);
                return res.status(500).json({ message: 'Error during password comparison' });
            }
        } else {
            // User not found
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    });
});


// Get all requests endpoint -- NEEDS TOKEN
app.get("/requests", (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, privateKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }

        const q = "SELECT * FROM requests";
        db.query(q, (err, data) => {
            if (err) return res.json(err);
            for (let element of data) {
                element.creation_date = moment(element.creation_date).tz('Asia/Riyadh').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
            }
            return res.json(data);
        });
    });
});

// Add new request -- NEEDS TOKEN
app.post("/requests", (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, privateKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }

        const q = "INSERT INTO requests (`title`, `description`, `status`, `creator`, `creation_date`) VALUES (?)";
        const values = [
            req.body.title,
            req.body.description,
            req.body.status,
            user.username,
            new Date()
        ];
        db.query(q, [values], (err, data) => {
            if (err) return res.json(err);
            return res.json("A Request Has Been Added!");
        });
    });

});

// Delete request -- NEEDS TOKEN
app.delete("/requests/:id", (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, privateKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }

        const requestID = req.params.id;
        const q = "DELETE FROM requests WHERE id = ?";

        db.query(q, [requestID], (err, data) => {
            if (err) {
                console.error('Error deleting request:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (data.affectedRows === 0) {
                // If no rows were affected, the request with the given ID was not found
                return res.status(404).json({ error: 'Request not found' });
            }

            res.json("Request has been deleted!");
        });
    });

});

// Edit request -- NEEDS TOKEN
app.put('/requests/:id', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
  
    jwt.verify(token, privateKey, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
      }
    
      const requestId = parseInt(req.params.id);
      const { status } = req.body;
  
      const query = 'UPDATE requests SET status = ? WHERE id = ?';
  
      db.query(query, [status, requestId], (err, results) => {
          if (err) {
              console.error('Error updating status:', err);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
  
          // If no rows were affected, the request with the given ID was not found
          if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Request not found' });
          }
  
          res.json({ message: 'Status updated successfully' });
      });
    })
    
});


app.listen(9000, () => {
    console.log("Server is live at localhost:9000");
});
