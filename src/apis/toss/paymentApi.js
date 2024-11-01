// import axios from "axios";
//
// // 결제위젯 승인 요청
// export const confirmWidgetPayment = async ({ paymentKey, orderId, amount }) => {
//   try {
//     const response = await axios.post("http://localhost:8080/confirm/widget", {
//       paymentKey,
//       orderId,
//       amount,
//     }, { withCredentials: true });
//     console.log("결제위젯 승인 성공:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("결제위젯 승인 실패:", error.response?.data || error.message);
//     throw error;
//   }
// };
//
// // 결제창 승인 요청
// export const confirmPayment = async ({ paymentKey, orderId, amount }) => {
//   try {
//     const response = await axios.post("http://localhost:8080/confirm/payment", {
//       paymentKey,
//       orderId,
//       amount,
//     }, { withCredentials: true });
//     console.log("결제창 승인 성공:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("결제창 승인 실패:", error.response?.data || error.message);
//     throw error;
//   }
// };
//
// // 브랜드페이 승인 요청
// export const confirmBrandPay = async ({ paymentKey, orderId, amount, customerKey }) => {
//   try {
//     const response = await axios.post("http://localhost:8080/confirm/brandpay", {
//       paymentKey,
//       orderId,
//       amount,
//       customerKey,
//     }, { withCredentials: true });
//     console.log("브랜드페이 승인 성공:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("브랜드페이 승인 실패:", error.response?.data || error.message);
//     throw error;
//   }
// };
//
// // 브랜드페이 Access Token 발급 요청
// export const getBrandPayAccessToken = async ({ customerKey, code }) => {
//   try {
//     const response = await axios.get("http://localhost:8080/callback-auth", {
//       params: {
//         customerKey,
//         code,
//       },
//     }, { withCredentials: true });
//     console.log("Access Token 발급 성공:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Access Token 발급 실패:", error.response?.data || error.message);
//     throw error;
//   }
// };
//
// // 빌링키 발급 요청
// export const issueBillingKey = async ({ customerKey, authKey }) => {
//   try {
//     const response = await axios.post("http://localhost:8080/issue-billing-key", {
//       customerKey,
//       authKey,
//     }, { withCredentials: true });
//     console.log("빌링키 발급 성공:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("빌링키 발급 실패:", error.response?.data || error.message);
//     throw error;
//   }
// };
//
// // 카드 자동결제 승인 요청
// export const confirmBillingPayment = async ({
//   customerKey,
//   amount,
//   orderId,
//   orderName,
//   customerEmail,
//   customerName,
// }) => {
//   try {
//     const response = await axios.post("http://localhost:8080/confirm-billing", {
//       customerKey,
//       amount,
//       orderId,
//       orderName,
//       customerEmail,
//       customerName,
//     }, { withCredentials: true });
//     console.log("자동결제 승인 성공:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("자동결제 승인 실패:", error.response?.data || error.message);
//     throw error;
//   }
// };
