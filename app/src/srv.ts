import cluster from "cluster"
import os from "os"
import {AWS_REKOG_COLNAMES} from "./consts/AWS_REKOG_COLNAMES"
import {createMongoStoreIndexes} from "./db/stores.srv"
import {srvConf} from "./srvConf"
import {auth_email_edge} from "./ui/auth/auth_email_edge"
import {formatZodErrors} from "./utils/formatZodErrors"
import {ensureCollectionsExists} from "./utils/rekogUtils"
import {Edge} from "./utils/server/createEdge"
import {createEdgeServer} from "./utils/server/serverCreate"

const START_TIME = Date.now()
const MAX_CLUSTER_WORKERS = 3
const EDGE_ARRAY: Edge<any>[] = [auth_email_edge].flat()

if (srvConf.URL_CLIENT.includes("localhost")) {
  startServer()
  runSetup()
} else {
  // Cluster the app to take advantage of multi-core systems in production
  if (cluster.isPrimary) {
    // Call only once
    runSetup()

    // Fork a worker for each CPU
    for (let i = 0; i < Math.min(os.cpus().length, MAX_CLUSTER_WORKERS); i++) {
      cluster.fork()
    }
  } else {
    startServer()
  }
}

async function startServer() {
  formatZodErrors()

  // Start the server
  createEdgeServer(EDGE_ARRAY).listen(srvConf.PORT, () => {
    console.log(`Port: ${srvConf.PORT}`)
    console.log(`Worker: ${cluster.worker?.id}`)
  })
}

async function runSetup() {
  let tasks: Promise<any>[] = []

  // Create indexes on all MongoDB collections
  tasks.push(createMongoStoreIndexes())

  // Create an index on the "id" field for all MongoDB collections
  // tasks.push(createIdIndexOnMongoCollections())

  // Ensure the AWS Rekognition collections exist
  tasks.push(ensureCollectionsExists(Object.values(AWS_REKOG_COLNAMES)))

  // Wait for all tasks to complete
  await Promise.all(tasks)

  console.log("Setup:", Date.now() - START_TIME, "ms")
}
