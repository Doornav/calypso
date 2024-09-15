import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { G, Circle } from "react-native-svg";

interface StockData {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: StockData[];
  total: number;
  radius?: number;
  strokeWidth?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  total,
  radius = 70,
  strokeWidth = 40,
}) => {
  const circleCircumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0; // Keeps track of the offset for each stock

  return (
    <View style={styles.container}>
      <View style={styles.graphWrapper}>
        <Svg height={radius * 2 + strokeWidth} width={radius * 2 + strokeWidth} viewBox="0 0 180 180">
          <G rotation={-90} originX="90" originY="90">
            {/* Render each stock as a segment of the donut chart */}
            {data.map((stock, index) => {
              const percentage = (stock.value / total) * 100;
              const strokeDashoffset =
                circleCircumference * (1 - percentage / 100); // Calculate correct offset

              const segment = (
                <Circle
                  key={index}
                  cx="50%"
                  cy="50%"
                  r={radius}
                  stroke={stock.color}
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={cumulativeOffset}
                  strokeLinecap="butt"
                />
              );

              // Update the cumulative offset for the next segment
              cumulativeOffset += circleCircumference * (percentage / 100);

              return segment;
            })}
          </G>
        </Svg>
        {/* Display total amount in the center */}
        <Text style={styles.text}>${total.toLocaleString()}</Text>
      </View>
    </View>
  );
};

export default DonutChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  graphWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    position: "absolute",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 18,
    color: "#394867",
  },
});
