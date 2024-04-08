const { verifyAuth } = require('./auth');

const addBalance = async (req, res, usersCollection, transactionsCollection) => {
  return new Promise(async (resolve, reject) => {
    const correctPaymentOptions = [
      "Card",
      "Blik",
      "Przelewy24",
      "PayPal"
    ];

    const correctBalanceOptions = [
      20,
      50,
      100,
      200,
      500
    ];

    try {
      const isValidLogin = await verifyAuth(req, res);
      const { paymentOption, balanceOption } = req.body;

      if (isValidLogin === true) {
        const username = req.cookies.username;

        if (paymentOption && balanceOption) {
          if (!correctPaymentOptions.includes(paymentOption) || isNaN(balanceOption) || !correctBalanceOptions.includes(balanceOption)) {
            reject({ status: 400, error: "Niepoprawne opcje dla dodania środków." });
            return;
          }

          const userProfile = await usersCollection.findOne({ "username": username });
          const newWalletBalance = parseFloat((userProfile.walletBalance + balanceOption).toFixed(2));

          const transaction = {
            type: "Funds add to balance",
            date: new Date(),
            value: balanceOption,
            payment: paymentOption,
            oldBalance: userProfile.walletBalance,
            newBalance: newWalletBalance,
            billingInfo: userProfile.address
          };

          await new Promise(resolve => setTimeout(resolve, 5000));

          const addTransaction = await transactionsCollection.insertOne(transaction);

          if (addTransaction.acknowledged === true) {
            const updateBalance = await usersCollection.updateOne({ _id: userProfile._id }, { $set: { walletBalance: newWalletBalance }, $push: { transactions: addTransaction.insertedId } });

            if (updateBalance.modifiedCount === 1) {
              resolve({ status: "success" });
            }
          }

        } else {
          reject({ status: 400, error: "Brakuje danych do dodania salda." });
        }
      }

    } catch (err) {
      console.error(err);
      reject({ status: 500, error: "Wystąpił błąd serwera." });
    }
  });
};

module.exports = { addBalance };