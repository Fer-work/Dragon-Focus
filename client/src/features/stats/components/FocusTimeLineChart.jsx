import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Text, // For custom labels or messages
} from "recharts";
import { useTheme } from "@mui/material/styles";
import { Typography, Paper } from "@mui/material";

const FocusTimelineChart = ({ data, isLoading, periodLabel }) => {
  const theme = useTheme();

  // Define colors from your theme for the chart
  const barColor = theme.palette.primary.main;
  const textColor = theme.palette.text.secondary;
  const tooltipBackgroundColor = theme.palette.background.paper;
  // REVISED: Simplified to use the semantic divider color directly.
  const borderColor = theme.palette.divider;

  // REVISED: Created a reusable style object for placeholder Paper components
  const placeholderStyles = {
    p: 3,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 300,
    bgcolor: "background.paper",
    border: `1px solid ${borderColor}`,
    borderRadius: 3, // Consistent with other panels
    boxShadow: theme.shadows[3],
  };

  if (isLoading) {
    return (
      <Paper sx={placeholderStyles}>
        <Typography variant="h6" color="text.secondary">
          Loading chart data...
        </Typography>
      </Paper>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Paper sx={placeholderStyles}>
        <Typography variant="h6" color="text.secondary">
          Not enough data to display {periodLabel || "timeline"} chart.
        </Typography>
      </Paper>
    );
  }

  // Custom Tooltip component is well-styled.
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={4}
          sx={{
            padding: "10px",
            backgroundColor: tooltipBackgroundColor,
            border: `1px solid ${borderColor}`, // Uses simplified variable
          }}
        >
          <Typography variant="subtitle2" sx={{ color: textColor }}>
            {`Day: ${label}`}
          </Typography>
          <Typography variant="body2" sx={{ color: barColor }}>
            {`Focus: ${payload[0].value} min`}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper
      elevation={0} // Using custom border/shadow instead
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        height: { xs: 300, sm: 350, md: 400 },
        bgcolor: "background.paper",
        // REVISED: Made styling consistent with other panels
        border: `1px solid ${borderColor}`,
        borderRadius: 3,
        boxShadow: theme.shadows[3], // Using a subtle theme shadow
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {/* The BarChart itself is perfectly styled using theme variables. No changes needed. */}
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={textColor}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke={textColor}
            tick={{ fontSize: 12, fill: textColor }}
            axisLine={{ stroke: textColor }}
            tickLine={{ stroke: textColor }}
          />
          <YAxis
            stroke={textColor}
            tick={{ fontSize: 12, fill: textColor }}
            label={{
              value: "Minutes Focused",
              angle: -90,
              position: "insideLeft",
              fill: textColor,
              fontSize: 14,
              dy: 40,
            }}
            axisLine={{ stroke: textColor }}
            tickLine={{ stroke: textColor }}
            allowDecimals={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: theme.palette.action.hover }}
          />
          <Legend wrapperStyle={{ color: textColor, paddingTop: "10px" }} />
          <Bar
            dataKey="minutes"
            fill={barColor}
            name="Focus Time"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default FocusTimelineChart;
