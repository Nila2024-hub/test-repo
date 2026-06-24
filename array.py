import array

# 'd' represents double-precision floating-point numbers (8 bytes each)
sensor_readings = array.array('d', [23.5, 24.1, 22.8, 25.0, 24.6])

# Arrays support appending and slicing just like lists
sensor_readings.append(23.9)

# Performance concept: Performing an operation over the array
# We create a new array with calibrated values (+0.5 offset)
calibrated_readings = array.array('d', [val + 0.5 for val in sensor_readings])

print(f"Original typecode: {sensor_readings.typecode}")
print(f"Calibrated Array: {calibrated_readings}")
