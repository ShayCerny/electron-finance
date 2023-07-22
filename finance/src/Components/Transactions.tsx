import 'Styles/Transactions.scss';

import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

declare global {
    interface Window {
        api?: any
    }
}


const Transactions = () => {
    const [transactions, setTransactions] = useState([] as Transaction[])
    const [newTransactionName, setNewTransactionName] = useState("");
    const [newTransactionAmount, setNewTransactionAmount] = useState(0);
    const [newTransactionDebt, setNewTransactionDebt] = useState(false);
    const [newTransactionExpense, setNewTransactionExpense] = useState(false);
    const [newTransactionOwed, setNewTransactionOwed] = useState(0);
    const [monthlyIncome, setMonthlyIncome] = useState(0);
    const [monthlyExpense, setMonthlyExpense] = useState(0);

    const fs = window.api.fs;
    const path = window.api.path;
    const dirName = window.api.dirName;

    const filePath = path.join(dirName, '../assets/transactions.txt');

    const clearForm = () => {
        setNewTransactionName('');
        setNewTransactionAmount(0);
        setNewTransactionExpense(false);
        setNewTransactionDebt(false);
        setNewTransactionOwed(0);
    }

    const saveTransaction = async () => {
        const newTransaction = {
            name: newTransactionName,
            amount: newTransactionAmount,
            expense: newTransactionExpense,
            debt: newTransactionDebt,
            owed: newTransactionOwed,
        } as Transaction;

        let temp = [...transactions];
        temp.push(newTransaction);

        fs.writeFile(filePath, JSON.stringify(temp, null, 2), (err: any) => {
            if (err) console.error(err);
            else {
                setTransactions(temp);
                clearForm();
            }
        })


    }

    const processData = (data: string) => {
        console.log(data)
        const temp = JSON.parse(data);
        setTransactions(temp);

        let tempIncome = 0;
        let tempExpense = 0;

        for (const t in temp) {
            const element = temp[t] as Transaction;
            if (element.expense) {
                tempExpense += element.amount;
            } else {
                tempIncome += element.amount;
            }
        }
        setMonthlyIncome(tempIncome);
        setMonthlyExpense(tempExpense);
    }


    const getTransactions = () => {
        fs.readFile(filePath, 'utf8', (err: any, data: string) => {
            if (err) {
                console.error(err);
            } else {
                processData(data);
            }
        })
    }


    useEffect(() => {
        getTransactions()
    }, [])

    return (
        <div className="transaction-page">
            <div className="quick-info">
                <h1>Monthly Income: ${monthlyIncome}</h1>
                <h1>Monthly Expenses: ${monthlyExpense}</h1>
                <h1>Net Income: ${monthlyIncome - monthlyExpense}</h1>
            </div>
            <div className="transaction-section">
                <div className="transactions">
                    <div className="header">
                        <h5>Name</h5>
                        <h5>Amount</h5>
                        <h5>Debt?</h5>
                        <h5>Total Owed</h5>
                    </div>
                    {transactions.map((t: Transaction, index) => (
                        <div className={`transaction ${t.expense ? 'expense' : ''}`} key={index}>
                            <p>{t.name}</p>
                            <p>${t.amount}</p>
                            {t.debt ? <FontAwesomeIcon icon={faSquareCheck} /> : <FontAwesomeIcon icon={faSquare} />}
                            <p>${t.owed}</p>
                        </div>
                    ))}
                </div>
                <div className="add-transaction-form">
                    <h2>Add Transaction</h2>
                    <div className="form">
                        <input value={newTransactionName} onChange={(e) => setNewTransactionName(e.target.value)} type="text" placeholder='Transaction Name' />
                        <input value={newTransactionAmount} onChange={(e) => setNewTransactionAmount(Number(e.target.value))} type="number" placeholder='Transaction Amount' />
                        <div className="row">
                            <div className="col">
                                <label>Expense?</label>
                                <input checked={newTransactionExpense} onChange={(e) => setNewTransactionExpense(e.target.checked)} className='checkbox' type="checkbox" />
                            </div>
                            <div className="col">
                                <label>Debt?</label>
                                <input checked={newTransactionDebt} onChange={(e) => setNewTransactionDebt(e.target.checked)} className='checkbox' type="checkbox" />
                            </div>
                        </div>
                        {newTransactionDebt ? <input value={newTransactionOwed} onChange={(e) => setNewTransactionOwed(Number(e.target.value))} type="number" placeholder='Amount Owed' /> : null}
                        <button onClick={() => saveTransaction()} className='btn'>Add</button>
                    </div>
                </div>
            </div>
        </div >
    )
}
export default Transactions;