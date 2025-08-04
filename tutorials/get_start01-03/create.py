import requests

url = "https://api.keywordsai.co/api/users/create/"
api_key = "iEolcm0o.efYJQyA9nL0oRTUM1odk235AMPDke3B9" # Replace with your actual Keywords AI API key
data = {
    "period_budget": 30,
    "customer_identifier": "some_customer_identifier",
    "organization_id": "97671655-8883-4fd3-94fe-8d57035ff4bd"
}
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

response = requests.post(url, headers=headers, json=data)
print(response.json())