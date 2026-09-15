import {test, expect} from "@playwright/test";

const newBooking = {
    firstname: "Deva",
    lastname: "Test",
    totalprice: 100,
    depositpaid: true,
    bookingdates: {
        checkin: "2026-10-01",
        checkout: "2026-10-02"
    },
    additionalneeds: "Breakfast"
};


test("POST creates a booking and return it", async ({request}) => {

    const response = await request.post("/booking", {
        data: newBooking
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("bookingid");
    expect(body.booking.firstname).toBe(newBooking.firstname);
    expect(body.booking.lastname).toBe(newBooking.lastname);
    expect(body.booking.totalprice).toBe(newBooking.totalprice);
});

test("PUT updates a booking", async ({ request }) => {
    // 1. get a token
    const auth = await request.post("/auth", {
        data: { username: "admin", password: "password123" },
    });
    const { token } = await auth.json();

    // 2. create a booking to update
    const created = await request.post("/booking", { data: newBooking });
    const { bookingid } = await created.json();

    // 3. update it, sending the token
    const updated = await request.put(`/booking/${bookingid}`, {
        headers: { Cookie: `token=${token}` },
        data: { ...newBooking, firstname: "Updated" },
    });

    expect(updated.status()).toBe(200);
    const body = await updated.json();
    expect(body.firstname).toBe("Updated");
});

test("DELETE removes a booking", async ({ request }) => {
    // token
    const auth = await request.post("/auth", {
        data: { username: "admin", password: "password123" },
    });
    const { token } = await auth.json();

    // create something to delete
    const created = await request.post("/booking", { data: newBooking });
    const { bookingid } = await created.json();

    // delete it
    const deleted = await request.delete(`/booking/${bookingid}`, {
        headers: { Cookie: `token=${token}` },
    });
    expect(deleted.status()).toBe(201);        // restful-booker returns 201, oddly

    // prove it's gone — this is the part that matters
    const check = await request.get(`/booking/${bookingid}`);
    expect(check.status()).toBe(404);
});
