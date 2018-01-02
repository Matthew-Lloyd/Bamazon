# Bamazon

This application simulates a shopping experience using Node.js & the MySQL database.

# Step 1

First, we launch the application and ask the user if they'd like to make a purchase. (Choosing 'No' will wish you a happy day and close the connection)

![Step 1](/images/step1.png)

# Step 2

Next, we ask the user which items and give them a checkbox from which they can select.

![Step 2](/images/step2.png)

This allows you to purchase multiple items at a time!

![Step 2-selected](/images/step3.png)


# Step 3

Then, we ask the user how many of each item would they like to purchase which compares to the active stock quantity in mySQL (as we'll see in a moment)


![Step 3](/images/step4.png)

If there's not enough stock quantity, this is how we alert the user to retry.

![Insufficient Qty](/images/step6.png)


# Step 4

Finally, if there's no issues, we confirm each item, pull the ordered quantity from the database, and calculate a total cost for the user.  

![Step 4](/images/step7.png)