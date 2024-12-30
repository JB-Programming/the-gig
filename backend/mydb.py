import mysql.connector

dataBase = mysql.connector.connect(
    host = 'srv1475.hstgr.io',
    user = 'u319438334_H_G',
    passwd = 'Kp000000!!'
)

cursorObject = dataBase.cursor()

cursorObject.execute("CREATE DATABASE Hillmann_und_Geitz_DB")

print("All Done!")