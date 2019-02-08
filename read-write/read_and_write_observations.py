import MySQLdb
from ruuvitag_sensor.ruuvitag import RuuviTag

sensors = ['C2:CE:C6:B6:CF:6C','FB:D0:9F:EC:41:C7','C9:81:C7:79:A2:35']

# Connect to sql
db = MySQLdb.connect("localhost", "writer", "writer", "observations")
curs=db.cursor()

for mac in sensors:
  sensor = RuuviTag(mac)
  state = sensor.update()
  state = sensor.state

  pres = state["pressure"]
  temp = state["temperature"]
  relhum = state["humidity"]
  sensorId = state["identifier"]

  # date DATE, time TIME, temperature NUMERIC, pressure NUMERIC, relativehumidity NUMERIC, identifier CHAR(1)
  # Write to database
  curs.execute ("""INSERT INTO observations
                   VALUES (CURRENT_DATE(), NOW(), {}, {}, {}, UNIX_TIMESTAMP(), '{}')""".format(temp, pres, relhum, sensorId))

db.commit()
db.close()

