
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import DonutChart from "./DonutChart"; // Assuming you have the DonutChart component from before

interface StockData {
  name: string;
  value: number;
  color: string;
  change: number; // Percentage change of the stock value (positive for gain, negative for loss)
}

interface InvestmentAccountProps {
  accessToken: string;
  accountName: string;
}

const InvestmentAccount: React.FC<InvestmentAccountProps> = ({ accessToken, accountName }) => {
  const [data, setData] = useState<StockData[]>([]);
  const [dailyReturn, setDailyReturn] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [date, setDate] = useState<string>("");
  const access_token = userInfo.access_token;
  useEffect(() => {
    fetchInvestmentData();
  }, []);

  const fetchInvestmentData = async () => {
    try {
      const response = await fetch("http://localhost:5001/users/get_investment_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: accessToken }),
      });

      const result = await response.json();
      const stockData = mapHoldingsToStockData(result.holdings);

      // Calculate daily return based on stock data
      const dailyReturnValue = calculateDailyReturn(stockData);

      setData(stockData);
      setDailyReturn(dailyReturnValue);
      setDate(new Date().toLocaleDateString());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching investment data:", error);
      setLoading(false);
    }
  };

  const mapHoldingsToStockData = (holdings: any[]): StockData[] => {
    return holdings.map((holding) => {
      const { security } = holding;
      const value = holding.quantity * security.close_price;
      const change =
        security.previous_close_price && security.previous_close_price !== 0
          ? ((security.close_price - security.previous_close_price) / security.previous_close_price) * 100
          : 0;

      return {
        name: security.ticker_symbol || security.name,
        value,
        color: getRandomColor(),
        change: parseFloat(change.toFixed(2)),
      };
    });
  };

  const calculateDailyReturn = (stockData: StockData[]): number => {
    const totalValue = stockData.reduce((sum, stock) => sum + stock.value, 0);
    const totalChange = stockData.reduce((sum, stock) => sum + (stock.value * stock.change) / 100, 0);
    const dailyReturnPercentage = (totalChange / totalValue) * 100;
    return parseFloat(dailyReturnPercentage.toFixed(2));
  };

  const getRandomColor = (): string => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  // Calculate total value
  const total = data.reduce((sum, stock) => sum + stock.value, 0);

  // Find the top gainer and top loser
  const topGainer = data.reduce((prev, current) => (current.change > prev.change ? current : prev));
  const topLoser = data.reduce((prev, current) => (current.change < prev.change ? current : prev));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Account Name and Return Information */}
      <View style={styles.header}>
        <Text style={styles.accountName}>{accountName}</Text>
        <Text style={styles.returnText}>
          Daily Return: {dailyReturn > 0 ? "+" : ""}
          {dailyReturn}% 
        </Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      {/* Donut Chart */}
      <DonutChart data={data} total={total} radius={80} strokeWidth={30} />

      {/* Top Gainer and Loser */}
      <View style={styles.gainLossContainer}>
        <Text style={styles.gainLossText}>
          Top Gainer: {topGainer.name} ({topGainer.change}%)
        </Text>
        <Text style={styles.gainLossText}>
          Top Loser: {topLoser.name} ({topLoser.change}%)
        </Text>
      </View>

      {/* Legend with all stocks */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Stock Breakdown:</Text>
        {data.map((stock, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColorBox, { backgroundColor: stock.color }]} />
            <Text style={styles.legendText}>
              {stock.name}: ${stock.value.toLocaleString()} ({stock.change}%)
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default InvestmentAccount;

// ... styles remain the same ...


const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  accountName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#14274E",
  },
  returnText: {
    fontSize: 18,
    color: "#394867",
    marginTop: 5,
  },
  date: {
    fontSize: 16,
    color: "#8D99AE",
    marginTop: 5,
  },
  gainLossContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  gainLossText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  legendContainer: {
    marginTop: 20,
    width: "100%",
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  legendColorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  legendText: {
    fontSize: 16,
    color: "#394867",
  },
});
