# MSG91 OTP Setup (Later / Go-Live)

Use this when moving from local OTP testing (`SMS_DRIVER=log`) to real MSG91 OTP delivery.

## 1. Update `.env`

```env
SMS_DRIVER=msg91
MSG91_AUTH_KEY=your_msg91_auth_key
MSG91_TEMPLATE_ID=your_msg91_template_id
MSG91_BASE_URL=https://control.msg91.com/api/v5
MSG91_COUNTRY_CODE=91
```

## 2. Refresh config cache

Run:

```bash
php artisan config:clear
php artisan cache:clear
```

## 3. Quick functional check

1. Open `/login`.
2. Enter a valid mobile number.
3. Send OTP.
4. Confirm OTP is received on phone.
5. Verify OTP and confirm login redirects to location selection.
6. Test resend OTP after cooldown.

## 4. Important production notes

1. DLT/template approval is required for real SMS delivery in India.
2. `MSG91_TEMPLATE_ID` must match the OTP template configured in MSG91.
3. Make sure the template supports your OTP variable format.
4. In production, keep `APP_DEBUG=false`.

## 5. Local testing mode (current)

If you want to continue local testing without SMS delivery:

```env
SMS_DRIVER=log
APP_DEBUG=true
```

In this mode:

1. OTP is not sent to mobile.
2. OTP is available in logs and shown in the login UI test banner.
3. `000000` also works as debug bypass OTP.

## 6. Rollback

If MSG91 is not working yet, switch back to:

```env
SMS_DRIVER=log
```

Then clear config again:

```bash
php artisan config:clear
```
