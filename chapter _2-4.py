# Converting numbers to strings with the format() function

string_a = "{}".format(10)

# outputting
print( string_a)
print(type(string_a))  



 # Integer
output_a = "{:d}".format(52)
 # Printing in specific spaces
output_b = "{:5d}".format(52)     # 5 spaces
output_c = "{:10d}".format(52)    # 10 spaces
# Filling empty spaces with 0
output_d = "{:05d}".format(52)    # Positive
output_e = "{:05d}".format(-52)   # Negative

print("# Basic")
print(output_a)
print("# Printing in specific slots")
print(output_b)
print(output_c)
print("# Filling empty spaces with 0")
print(output_d)
print(output_e)




# Printing with signs
output_f = "{:+d}".format(52)   # Positive: show + sign
output_g = "{:+d}".format(-52)  # Negative: show - sign
output_h = "{: d}".format(52)   # Positive: space in sign position
output_i = "{: d}".format(-52)  # Negative: show - sign

print("# Printing with signs")
print(output_f)
print(output_g)
print(output_h)
print(output_i)


# Combining string formatting options

# 1. Push sign to the back (Right-aligned, sign stays next to the number)
output_h = "{:+5d}".format(52)    # Push sign to the back: positive
output_i = "{:+5d}".format(-52)   # Push sign to the back: negative

# 2. Push sign to the front (Sign is fixed at the very start of the padding area)
output_j = "{:=+5d}".format(52)   # Push sign to the front: positive
output_k = "{:=+5d}".format(-52)  # Push sign to the front: negative

# 3. Fill with zeros (Fills the empty space with zeros instead of spaces)
output_l = "{:+05d}".format(52)   # Fill with zeros: positive
output_m = "{:+05d}".format(-52)  # Fill with zeros: negative

# Print the execution results
print("# Combinations")
print(output_h)
print(output_i)
print(output_j)
print(output_k)
print(output_l)
print(output_m)



# 1. Assign the string to variable 'a'
a = "Hello Python Programming...!"

# 2. Convert to lowercase and display the result
print(a.lower())

# Define a multi-line string with unintended newlines at the start and end
input_a = """
안녕하세요
문자열 함수를 알아봅시다
"""

# Print the original string (includes the top and bottom newlines)
print("--- Original Output ---")
print(input_a)

# Print the cleaned string using the strip() function to remove surrounding newlines
print("--- Cleaned Output ---")
print(input_a.strip())





# Class Definition (Blueprint)

class Car:

    def horn(self):
        return "Beep beep!"


# Object Instantiation
my_car = Car()
print(my_car.horn())  # Output: Beep beep!

# 1. Class Blueprint Definition
class SmartDevice:
    # Minimal placeholder block
    pass  

# 2. Creating Object Instances
phone1 = SmartDevice()
phone2 = SmartDevice()

# 3. Memory References
print(phone1)  
# Output: <__main__.SmartDevice object at 0x7f8a...>
print(phone2)  
# Output: <__main__.SmartDevice object at 0x7f8b...>




class Smartphone:
    # Constructor initializes attributes
    def __init__(self, brand, battery):
        self.brand = brand        # Attribute
        self.battery = battery    # Attribute

# Creating instances with initial data
phone_a = Smartphone("Apple", 100)
phone_b = Smartphone("Samsung", 85)

print(phone_a.brand)    # Output: Apple
print(phone_b.battery)  # Output: 85


class Smartphone:
    def __init__(self, brand, battery):
        self.brand = brand
        self.battery = battery

    # Method defining phone behavior
    def make_call(self, number):
        self.battery -= 5
        return f"Calling {number}... Battery: {self.battery}%"

my_phone = Smartphone("Google Pixel", 90)
print(my_phone.make_call("555-0199"))
# Output: Calling 555-0199... Battery: 85%   


class Dog:
    # Constructor method (initializes instance attributes)
    def __init__(self, name, breed):
        self.name = name    # Instance variable
        self.breed = breed  # Instance variable

    # Regular method
    def bark(self):
        return f"{self.name} says Woof!"

# Creating objects
dog1 = Dog("Buddy", "Golden Retriever")
dog2 = Dog("Max", "Bulldog")

# Calling methods
print(dog1.bark())  # Output: Buddy says Woof!
print(dog2.bark())  # Output: Max says Woof!





class Smartphone:
    # 1. CONSTRUCTOR: Runs automatically when creating a new phone
    def __init__(self, brand, color):
        self.brand = brand   # Assigning "brand" to THIS phone
        self.color = color   # Assigning "color" to THIS phone

    # 2. METHOD: An action THIS phone can do
    def make_call(self, person):
        # 'self.brand' refers to THIS phone's brand
        print(f"Calling {person} from my {self.color} {self.brand}!")


# --- USING THE CLASS ---

# When we run this line, __init__ runs AUTOMATICALLY behind the scenes
my_phone = Smartphone("Apple", "Black")
friend_phone = Smartphone("Samsung", "Silver")

# Calling the METHOD on my_phone
my_phone.make_call("Alex")
# Output: Calling Alex from my Black Apple!

# Calling the METHOD on friend_phone
friend_phone.make_call("Sarah")
# Output: Calling Sarah from my Silver Samsung!


class Animal:
    pass

class Vehicle:
    pass

pet = Animal()

# Checking instances
print(isinstance(pet, Animal))   # Output: True
print(isinstance(pet, Vehicle))  # Output: False



class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

    # Special method triggered when str() or print() is used
    def __str__(self):
        return f"'{self.title}' by {self.author}"

my_book = Book("1984", "George Orwell")

# Automatically triggers __str__
print(my_book)  # Output: '1984' by George Orwell





class Employee:
    # Class Variable (shared across all instances)
    company_name = "TechCorp"
    employee_count = 0

    def __init__(self, name):
        self.name = name  # Instance variable
        Employee.employee_count += 1  # Update class variable

    # Class Method (decorated with @classmethod)
    @classmethod
    def set_company_name(cls, new_name):
        cls.company_name = new_name

# Creating instances
emp1 = Employee("Alice")
emp2 = Employee("Bob")

print(emp1.company_name)      # Output: TechCorp
print(Employee.employee_count) # Output: 2

# Changing company name via class method affects all instances
Employee.set_company_name("MegaCorp")
print(emp1.company_name)      # Output: MegaCorp
print(emp2.company_name)      # Output: MegaCorp





if fish_length >= 30:
    print("This is a Sea Bream!")