import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import DonutChart from "./DonutChart"; // Assuming you have the DonutChart component from before

interface StockData {
  name: string;
  value: number;
  color: string;
  change: number; // Percentage change of the stock value (positive for gain, negative for loss)
}

interface InvestmentAccountProps {
  accountName: string;
  date: string;
  data: StockData[];
  dailyReturn: number;
}

const InvestmentAccount: React.FC<InvestmentAccountProps> = ({
  accountName,
  date,
  data,
  dailyReturn,
}) => {
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
            <View
              style={[styles.legendColorBox, { backgroundColor: stock.color }]}
            />
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
