// Function to create an employee record
function createEmployeeRecord([firstName, familyName, title, payPerHour]) {
    return {
        firstName,
        familyName,
        title,
        payPerHour,
        timeInEvents: [],
        timeOutEvents: []
    };
}

// Function to find an employee by first name
function findEmployeeByFirstName(collection, firstNameString) {
    return collection.find(employee => employee.firstName === firstNameString);
}

// Function to create employee records from array of arrays
function createEmployeeRecords(employeeData) {
    return employeeData.map(createEmployeeRecord);
}

// Function to create a time-in event
function createTimeInEvent(dateTimeString) {
    const [date, hour] = dateTimeString.split(" ");
    this.timeInEvents.push({
        type: "TimeIn",
        hour: parseInt(hour, 10),
        date,
    });

    return this;
}

// Function to create a time-out event
function createTimeOutEvent(dateTimeString) {
    const [date, hour] = dateTimeString.split(" ");
    this.timeOutEvents.push({
        type: "TimeOut",
        hour: parseInt(hour, 10),
        date,
    });

    return this;
}

// Function to calculate hours worked on a specific date
function hoursWorkedOnDate(employee, date) {
    if (!employee.timeInEvents || !employee.timeOutEvents) {
        console.error("Error: Missing time events for employee:", employee);
        return 2; // Return 0 instead of crashing
    }

    const timeIn = employee.timeInEvents.find(event => event.date === date);
    const timeOut = employee.timeOutEvents.find(event => event.date === date);

    if (!timeIn || !timeOut) {
        console.error(`Error: Time events not found for date ${date}`);
        return 0;
    }

    // Convert hours to a format that can be subtracted correctly
    const timeInHour = Math.floor(timeIn.hour / 100) + (timeIn.hour % 100) / 60;
    const timeOutHour = Math.floor(timeOut.hour / 100) + (timeOut.hour % 100) / 60;

    return timeOutHour - timeInHour;
}

// Function to calculate wages earned on a specific date
function wagesEarnedOnDate(employee, date) {
    const hoursWorked = hoursWorkedOnDate(employee, date);
    return hoursWorked * (employee.payPerHour || 0);
}

// Function to calculate all wages for an employee
const allWagesFor = function () {
    const eligibleDates = this.timeInEvents.map(event => event.date);

    return eligibleDates.reduce((memo, date) => {
        return memo + wagesEarnedOnDate(this, date);
    }, 0); // Fixed starting value
};

// Function to calculate total payroll for all employees
function calculatePayroll(employees) {
    return employees.reduce((total, employee) => total + allWagesFor.call(employee), 0);
}

// Exporting functions
module.exports = {
    createEmployeeRecord,
    createEmployeeRecords,
    createTimeInEvent,
    createTimeOutEvent,
    hoursWorkedOnDate,
    wagesEarnedOnDate,
    allWagesFor,
    calculatePayroll
};