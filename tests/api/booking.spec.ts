import {test, expect} from '@playwright/test';

test("GET a booking returns 200 and valid data", async ({ request }) => {
    const list = await request.get("/booking");        // ① creates `list`
    const bookings = await list.json();                 // ② uses `list`
    const id = bookings[0].bookingid;                   // ③ uses `bookings`

    const response = await request.get(`/booking/${id}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("firstname");
});

test("list endpoint returns data", async ({request}) => {

    const response = await request.get("/booking");

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
});

test("a non-existent booking ", async ({request}) => {

    const response= await request.get("/booking/999999");

    expect(response.status()).toBe(404);

})

