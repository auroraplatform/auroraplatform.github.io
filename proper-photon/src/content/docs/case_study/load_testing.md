---
title: "Load Testing Aurora"
description: "We conducted comprehensive load testing on Aurora to evaluate its performance across multiple dimensions."
---

Load testing plays a crucial role in understanding the performance boundaries of real-time analytics platforms. By simulating realistic usage patterns, load testing helps identify bottlenecks, optimize resource allocation, and ensure system reliability under high-volume conditions.

We conducted comprehensive load testing on Aurora to evaluate its performance across multiple dimensions: Kafka stream ingestion, ClickHouse query processing, AI-powered natural language query generation, and end-to-end user experience. Our testing methodology simulates real-world scenarios where data analysts and business users interact with streaming data through both traditional SQL queries and natural language interfaces.

_Note: As a small open-source team, we designed our tests to be cost-effective while still demonstrating Aurora's capabilities. Our infrastructure budget for testing was approximately $200 over a 3-day period._

## Methodology

### Infrastructure Setup

| Component | Configuration | Details | 
| ---- | ---- | ----  |
| **Kafka Cluster** | Single broker, 3 partitions per topic | Docker container on test machine | 
| **ClickHouse** | Instance Type: t3.large | vCPUs: 2, Memory: 8 GB, Storage: 50 GB gp3 | 
| **Aurora Backend** | Instance Type: t3.small | vCPUs: 2, Memory: 2 GB, FastAPI + Uvicorn | 
| **Aurora Frontend** | Local development | Next.js application running locally | 
| **AI Service** | OpenAI GPT-3.5-turbo | Cost-optimized model for natural language processing | 

### Data Generation and Ingestion

To demonstrate Aurora's real-world applicability, we simulated an e-commerce scenario where a small online retail platform needs to analyze real-time user behavior, product interactions, and sales metrics. This use case showcases Aurora's ability to handle moderate-frequency data streams while providing both technical and business users with flexible query interfaces.

We generated synthetic e-commerce data at varying ingestion rates:

- **Peak Load**: 500 events per second for 2 minutes
- **Sustained Load**: 200 events per second for 10 minutes
- **Burst Load**: 1,000 events per second for 30 seconds

Each event contained 12 fields including:

- `timestamp`: Event occurrence time
- `product_id`: Product identifier
- `price`: Product price
- `quantity`: Quantity purchased
- `user_id`: Customer identifier
- `action_type`: View/add_to_cart/purchase
- `session_id`: User session identifier
- `region`: Geographic region
- `user_type`: New/returning customer
- `category`: Product category
- `brand`: Product brand
- `device_type`: Mobile/desktop/tablet

### Dataset Description

Our test dataset consisted of 5 million historical e-commerce records spanning 1 month of simulated retail data. The dataset included:

- **User Interactions**: 3.5 million records of page views, cart additions, and purchases
- **Product Events**: 1 million product catalog updates and price changes
- **Session Data**: 0.5 million user session events

The data was partitioned by date for optimal query performance. We designed 6 test queries of varying complexity that represent common analytical tasks in e-commerce:

1. **Real-time Conversion Monitoring**: `SELECT COUNT(*) FROM events WHERE action_type = 'purchase' AND timestamp > now() - INTERVAL 1 HOUR`
2. **Sales Analysis**: `SELECT product_id, SUM(quantity) as total_sold FROM events WHERE action_type = 'purchase' AND timestamp >= '2024-01-01' GROUP BY product_id ORDER BY total_sold DESC LIMIT 10`
3. **Customer Behavior**: `SELECT user_id, COUNT(*) as interaction_count, AVG(price) as avg_price FROM events WHERE user_type = 'returning' GROUP BY user_id HAVING interaction_count > 50`
4. **Category Performance**: `SELECT category, AVG(price) as avg_price FROM events WHERE action_type = 'purchase' AND timestamp >= '2024-01-01' GROUP BY category ORDER BY avg_price DESC`
5. **Regional Analysis**: `SELECT region, COUNT(*) as event_count, AVG(price) as avg_price FROM events WHERE timestamp >= '2024-01-01' GROUP BY region ORDER BY event_count DESC`
6. **Time Series Analysis**: `SELECT toStartOfHour(timestamp) as hour, category, AVG(price) as avg_price FROM events WHERE category IN ('electronics', 'clothing', 'books') GROUP BY hour, category ORDER BY hour DESC LIMIT 50`

### Natural Language Query Testing

Aurora's unique value proposition lies in its AI-powered natural language query interface. We tested 4 natural language queries that business users might ask:

1. "Show me the top 5 best-selling products this week"
2. "What's the average order value for returning customers?"
3. "Which region has the most sales activity?"
4. "Show me hourly sales trends for electronics category"

### Measurement Methodology

We implemented monitoring across system components using open-source tools:

- **Kafka Metrics**: Message throughput, consumer lag (via Kafka Manager)
- **ClickHouse Performance**: Query execution time via built-in system tables
- **Aurora Backend**: API response times using custom logging
- **AI Processing**: OpenAI API response times and token usage
- **End-to-End Latency**: Total time from user request to response delivery

_Resource constraints: We used a combination of CloudWatch free tier, custom logging, and manual observation due to budget limitations._

## Load Testing Objectives

Our primary objectives were:

1. **Maintain Query Performance**: Ensure sub-2 second response times for 90% of SQL queries under sustained load
2. **AI Query Reliability**: Process natural language queries within 5 seconds
3. **Concurrent User Support**: Handle 15+ simultaneous users without significant performance degradation
4. **Data Freshness**: Maintain data availability with <10 second ingestion lag
5. **System Stability**: Achieve stable performance during moderate load conditions

## Results

### Stream Ingestion Performance

**Peak Load (500 events/sec for 2 minutes)**:

- Average ingestion latency: 1.2 seconds
- 99th percentile latency: 3.1 seconds
- Zero message loss
- ClickHouse insertion rate: 480 events/sec sustained

**Sustained Load (200 events/sec for 10 minutes)**:

- Average ingestion latency: 0.8 seconds
- 99th percentile latency: 2.1 seconds
- Zero message loss
- ClickHouse insertion rate: 195 events/sec sustained

**Burst Load (1,000 events/sec for 30 seconds)**:

- Average ingestion latency: 2.1 seconds
- 99th percentile latency: 5.8 seconds
- 0.3% message loss (temporary buffer overflow)
- ClickHouse insertion rate: 950 events/sec peak

### SQL Query Performance

Query performance tests were conducted on the 5 million row dataset while maintaining continuous data ingestion at 200 events per second. Each query was executed 5 times, and results include end-to-end API response times:

| Query | Complexity | Avg Time (s) | Min Time (s) | Max Time (s) | 95th Percentile (s) | 
| ---- | ---- | ---- | ---- | ---- | ----  |
| Real-time Conversion Monitoring | Simple | 0.31 | 0.24 | 0.42 | 0.38 | 
| Sales Analysis | Medium | 0.68 | 0.59 | 0.81 | 0.76 | 
| Customer Behavior | Medium | 0.89 | 0.76 | 1.05 | 0.98 | 
| Category Performance | Medium | 0.72 | 0.65 | 0.83 | 0.79 | 
| Regional Analysis | Simple | 0.45 | 0.38 | 0.54 | 0.51 | 
| Time Series Analysis | Complex | 1.24 | 1.12 | 1.41 | 1.35 | 

### Natural Language Query Performance

AI-powered query processing results (using GPT-3.5-turbo):

| Natural Language Query | Avg Processing Time (s) | Manual Validation Result | 
| ---- | ---- | ----  |
| "Show me the top 5 best-selling products this week" | 3.2 | Correct SQL generated | 
| "What's the average order value for returning customers?" | 2.8 | Correct SQL generated | 
| "Which region has the most sales activity?" | 2.1 | Correct SQL generated | 
| "Show me hourly sales trends for electronics category" | 4.1 | Mostly correct (minor syntax adjustment needed) | 

**Average Natural Language Processing Time**: 3.1 seconds **Manual Validation Success Rate**: 87.5% (3.5/4 queries generated correct SQL)

_Note: Due to resource constraints, we manually validated AI-generated queries rather than implementing automated accuracy testing._

### Concurrent User Performance

**15 Simultaneous Users**:

- Average API response time: 1.2 seconds
- 95th percentile response time: 2.1 seconds
- Error rate: 0.5%
- System CPU utilization: 68%
- Memory usage: 1.6 GB / 2 GB

**25 Simultaneous Users**:

- Average API response time: 2.8 seconds
- 95th percentile response time: 4.2 seconds
- Error rate: 3.1%
- System CPU utilization: 89%
- Memory usage: 1.9 GB / 2 GB

### Resource Utilization

| Component | CPU Usage | Memory Usage | Network I/O | 
| ---- | ---- | ---- | ----  |
| ClickHouse | 58% | 6.2 GB / 8 GB | 120 Mbps | 
| Aurora Backend | 42% | 1.4 GB / 2 GB | 15 Mbps | 
| Kafka Consumer | 18% | 512 MB / 1 GB | 25 Mbps | 

## Performance Analysis

### Strengths

1. **Good Query Performance**: Most SQL queries completed within 1.5 seconds for moderate-sized datasets
2. **Reliable Data Ingestion**: Maintained 99.7% message delivery rate during normal operations
3. **Functional AI Integration**: Natural language queries processed successfully in under 5 seconds
4. **Cost-Effective Architecture**: System handled 15 concurrent users on budget-friendly infrastructure
5. **Real-time Capabilities**: Data available for querying within 5 seconds of ingestion

### Limitations and Bottlenecks

1. **Memory Constraints**: ClickHouse memory usage approached limits during complex queries
2. **AI Processing Overhead**: Natural language queries require 3-4x more processing time than direct SQL
3. **Concurrent User Limits**: Performance degraded significantly beyond 20 simultaneous users
4. **Infrastructure Limits**: Single Kafka broker creates potential bottleneck for higher loads
5. **Cost Constraints**: Limited testing duration due to cloud infrastructure costs

### Optimization Opportunities

1. **Resource Scaling**: Upgrading to larger instances would improve performance but increase costs
2. **Caching Strategy**: Implementing query result caching for frequently accessed data
3. **AI Model Optimization**: Consider using local models to reduce API costs and latency
4. **Kafka Scaling**: Multiple brokers would improve ingestion reliability
5. **Connection Pooling**: Optimizing database connections for better concurrency

## Conclusion

Aurora successfully demonstrates the viability of combining real-time analytics with AI-powered natural language querying on a modest budget. The platform handles realistic small-to-medium workloads with 15+ concurrent users, processing 200+ events per second while maintaining reasonable response times for most queries.

The platform shows promise for small to medium-sized e-commerce organizations needing both technical and business user access to streaming data. While our testing was necessarily limited by budget constraints, the results indicate that Aurora's architecture is sound and could scale with additional resources.

With proper resource allocation as the project grows, Aurora can scale to support larger deployments while maintaining its core value proposition of simplifying and broadening data access through natural language interfaces.