import mariadb, {PoolConnection} from "mariadb";
import {generateUniqueFilename} from "./tools.js";
import config from "./config.json";

const mariadbPool = mariadb.createPool(config.databaseInfo);

async function insertNewFile(dbConnection, fileName : string, eventId : number){
    try {
        console.log("ATTEMPTING TO INSERT...")
        const insert = await dbConnection.query("INSERT INTO gallery (filename, eventId) VALUES (?, ?)", [fileName, eventId]);

        console.log(insert);
        const rows = await dbConnection.query("SELECT * FROM gallery");
        console.log(rows);

        return fileName;
    } catch (error) {
        console.error(error);
        return "ERROR";
    }
}

export async function getNewGalleryData(eventId: number, offset : number){
    const conn = await mariadbPool.getConnection();

    const results = await conn.query("SELECT * FROM gallery WHERE eventId = ? ORDER BY id DESC LIMIT 14 OFFSET ?", [eventId, offset]);

    await conn.release();

    return results;
}

export async function uploadNewFileDb(fileName : string, eventId : number) {
    const MaxAttempts = 3;
    const conn = await mariadbPool.getConnection();
    let InsertedSuccessfully = false;

    // Attempt to make the new file
    for (let attempt = 0; attempt < MaxAttempts; attempt++) {
        await insertNewFile(conn, fileName, eventId).then((result) => {
            if (result == "ERROR") {
                fileName = generateUniqueFilename(fileName);
            } else {
                attempt = MaxAttempts + 1;
                InsertedSuccessfully = true;
            }
        })
    }

    // Release our connection
    if (conn){
        await conn.release();
    }

    if (InsertedSuccessfully){
        return fileName;
    }
    else{
        return "ERROR";
    }
}