# ✅ TaskFlow — Task Manager App

A full-stack task manager built with React, Node.js, Express, and MongoDB Atlas. Deployable on AWS Free Tier.

---

## 📁 Project Structure

```
task-manager/
├── server/          ← Node + Express backend
└── client/          ← React frontend
```

---

## 🚀 Local Setup

### 1. Backend
```bash
cd server
npm install
cp .env.example .env         # Fill in your MongoDB Atlas URI
npm run dev                  # Runs on http://localhost:5000
```

### 2. Frontend
```bash
cd client
npm install
# Open src/App.jsx and set API = "http://localhost:5000/api/tasks"
npm start                    # Opens http://localhost:3000
```

---

## ☁️ AWS Deployment

### Backend → EC2
```bash
# SSH into your EC2 t2.micro instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# On the server
git clone <your-repo>
cd task-manager/server
npm install
npm install -g pm2

# Create .env file
echo "MONGO_URI=your_atlas_uri" > .env
echo "PORT=5000" >> .env

# Start server with PM2 (keeps running after logout)
pm2 start index.js
pm2 save
```

### Frontend → S3
```bash
# In src/App.jsx, update API to your EC2 public IP:
# const API = "http://<your-ec2-ip>:5000/api/tasks"

cd client
npm run build

# Upload build folder to S3
aws s3 sync build/ s3://your-bucket-name --acl public-read
```

### Enable S3 Static Hosting
1. S3 → your bucket → Properties → Static website hosting → Enable
2. Set index document: `index.html`
3. (Optional) Add CloudFront in front for HTTPS + speed

---

## ⚙️ EC2 Security Group — Open these ports
| Port | Purpose |
|------|---------|
| 22   | SSH     |
| 5000 | Node API |
| 80   | HTTP (optional) |

---

## 🔑 MongoDB Atlas Setup
1. Create free M0 cluster at mongodb.com/atlas
2. Add EC2's public IP to **Network Access**
3. Create a DB user and copy the connection string into `.env`
