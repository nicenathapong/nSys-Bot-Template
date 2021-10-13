import json
import mysql.connector

with open("./config.json","r",encoding="utf-8") as f:
    config = json.load(f)

def connect_to_database(client):
    try:
        client.mysql = mysql.connector.connect(
            host=config["database"]["host"],
            user=config["database"]["user"],
            password=config["database"]["password"],
            database=config["database"]["database"]
        )
        client.mysql.autocommit = True
        mycursor = client.mysql.cursor()
        mycursor.execute("select database()")
        db_name = mycursor.fetchone()[0]
        if client.mysql.is_connected():
            print(f"Connect to database [{db_name}] finish!")
    except Exception as err:
        print("[err] Can't connect to database [{0}]".format(config["database"]["database"]))
        print(err)
        connect_to_database(client)