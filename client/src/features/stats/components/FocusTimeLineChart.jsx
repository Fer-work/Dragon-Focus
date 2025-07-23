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
  const tooltipBorderColor =
    theme.palette.neutral?.[theme.palette.mode === "dark" ? 600 : 300] ||
    theme.palette.divider;

  if (isLoading) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 300,
          bgcolor: "background.paper",
          border: `1px solid ${tooltipBorderColor}`,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading chart data...
        </Typography>
      </Paper>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 300,
          bgcolor: "background.paper",
          border: `1px solid ${tooltipBorderColor}`,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Not enough data to display {periodLabel || "timeline"} chart.
        </Typography>
      </Paper>
    );
  }

  // Custom Tooltip for better styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={4}
          sx={{
            padding: "10px",
            backgroundColor: tooltipBackgroundColor,
            border: `1px solid ${tooltipBorderColor}`,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ color: textColor }}
          >{`Day: ${label}`}</Typography>
          <Typography
            variant="body2"
            sx={{ color: barColor }}
          >{`Focus: ${payload[0].value} min`}</Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        height: { xs: 300, sm: 350, md: 400 }, // Responsive height
        bgcolor: "background.paper",
        border: `1px solid ${tooltipBorderColor}`,
        borderRadius: 3,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20, // Adjusted right margin for YAxis labels
            left: 0, // Adjusted left margin
            bottom: 5,
          }}
          barGap={5} // Gap between bars of the same group (if multiple bars)
          barCategoryGap="20%" // Gap between categories (days)
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={textColor}
            vertical={false}
          />
          <XAxis
            dataKey="date" // Assumes your data objects have a 'date' property (e.g., 'Mon', 'Tue')
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
            cursor={{ fill: theme.palette.action.hover }} // Background color on hover over a bar area
          />
          <Legend wrapperStyle={{ color: textColor, paddingTop: "10px" }} />
          <Bar
            dataKey="minutes" // Assumes your data objects have a 'minutes' property
            fill={barColor}
            name="Focus Time" // Name for the legend
            radius={[4, 4, 0, 0]} // Rounded top corners for bars
            maxBarSize={50} // Max width of a bar
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default FocusTimelineChart;
