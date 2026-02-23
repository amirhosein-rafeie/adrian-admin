export interface paths {
    "/login/login_with_mobile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Start OTP login via SMS
         * @description Sends OTP code to the provided mobile number via SMS service.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["LoginWithMobileRequest"];
                };
            };
            responses: {
                /** @description OTP sent successfully via SMS */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "mobile_number": "09123456789"
                         *     }
                         */
                        "application/json": components["schemas"]["LoginWithMobileResponse"];
                    };
                };
                /** @description Request validation failed */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Key: 'LoginWithMobileRequest.MobileNumber' Error:Field validation for 'MobileNumber' failed on the 'startswith' tag"
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Internal server error (SMS service failure, database error) */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "send sms request: connection timeout"
                         *     }
                         */
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/login/send_otp_code": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Verify OTP and issue tokens
         * @description Verifies the OTP code and issues a JWT access token. Creates user if not exists.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["SendOTPCodeRequest"];
                };
            };
            responses: {
                /** @description OTP verified and access token issued */
                202: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "user": {
                         *         "id": 1,
                         *         "mobile_number": "09123456789",
                         *         "first_name": null,
                         *         "last_name": null
                         *       },
                         *       "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                         *       "status": "no_info",
                         *       "id_verification": {
                         *         "photo": {
                         *           "status": "pending"
                         *         },
                         *         "video": {
                         *           "status": "pending"
                         *         }
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["LoginResponse"];
                    };
                };
                /** @description Invalid request payload or OTP code */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Key: 'SendOTPCodeRequest.OTPCode' Error:Field validation for 'OTPCode' failed on the 'required' tag"
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Internal server error (database error, token generation failure) */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "cannot create token maker: invalid key size"
                         *     }
                         */
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/login/login_with_password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Login with mobile number and password
         * @description Authenticates a user using their mobile number and password.
         *     Returns the same response as the OTP login flow.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["LoginWithPasswordRequest"];
                };
            };
            responses: {
                /** @description Login successful, access token issued */
                202: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "user": {
                         *         "id": 1,
                         *         "mobile_number": "09123456789",
                         *         "first_name": "Ali",
                         *         "last_name": "Ahmadi"
                         *       },
                         *       "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                         *       "status": "active",
                         *       "id_verification": {
                         *         "photo": {
                         *           "status": "verified"
                         *         },
                         *         "video": {
                         *           "status": "verified"
                         *         }
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["LoginResponse"];
                    };
                };
                /** @description User not found, no password set, or incorrect password */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "invalid mobile number or password"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Internal server error (token generation failure) */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "cannot create token maker: invalid key size"
                         *     }
                         */
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/login/reset_password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Reset password using forgot-password OTP
         * @description Verifies the OTP sent via the forgot-password flow (`forgot_password: true` in `/login/login_with_mobile`)
         *     and sets a new password. The OTP expires after **3 minutes**.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ResetPasswordRequest"];
                };
            };
            responses: {
                /** @description Password reset successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "message": "password reset successfully"
                         *     }
                         */
                        "application/json": {
                            /** @example password reset successfully */
                            message?: string;
                        };
                    };
                };
                /** @description OTP not found/expired, invalid OTP, or validation error */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Internal server error (database error) */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "failed to update password"
                         *     }
                         */
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/login/complete_user_info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Submit KYC info (first login step)
         * @description Completes user profile with personal information and verifies IBAN ownership via Finnotech.
         *     Requires user status 'no_info'. After successful verification, user status changes to 'no_password'.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CompleteUserInfoRequest"];
                };
            };
            responses: {
                /** @description Success or user status mismatch */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["LoginResponse"] | components["schemas"]["UserStatusErrorResponse"];
                    };
                };
                /** @description Validation error or Finnotech IBAN verification failed */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"] | components["schemas"]["FinnotechVerificationErrorResponse"] | components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Missing or invalid Bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Wrong user role */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description User not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["NotFoundErrorResponse"];
                    };
                };
                /** @description Unique constraint violation — a field value is already taken by another user */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["DuplicateFieldErrorResponse"];
                    };
                };
                /** @description Internal server error (database error) */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
                /** @description Finnotech API unreachable or returned error */
                502: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["BadGatewayErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/login/register_password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Register a password after OTP login
         * @description Registers a password for the user. Requires user status 'no_password'.
         *     After successful registration, user status changes to 'active'.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["RegisterPasswordRequest"];
                };
            };
            responses: {
                /** @description Success or user status mismatch */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["LoginResponse"] | components["schemas"]["UserStatusErrorResponse"];
                    };
                };
                /** @description Request validation failed */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Key: 'RegisterPasswordRequest.Password' Error:Field validation for 'Password' failed on the 'required' tag"
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Missing or invalid Bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Wrong user role */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description User not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["NotFoundErrorResponse"];
                    };
                };
                /** @description Internal server error (password hashing failure, database error) */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "bcrypt: cost exceeds maximum allowed"
                         *     }
                         */
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/wallet/zibal/request": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create a Zibal payment session and pending wallet transaction
         * @description Creates a payment request with Zibal gateway and records a pending wallet transaction.
         *     Requires user status 'active'. Returns payment URL for user redirection.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ZibalPaymentRequest"];
                };
            };
            responses: {
                /** @description Success or user status mismatch */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "track_id": 123456789,
                         *       "payment_url": "https://gateway.zibal.ir/start/123456789",
                         *       "result": 100,
                         *       "message": "payment initialized",
                         *       "gateway_message": "success",
                         *       "transaction_id": 42
                         *     }
                         */
                        "application/json": components["schemas"]["ZibalPaymentResponse"] | components["schemas"]["UserStatusErrorResponse"];
                    };
                };
                /** @description Request validation failed or Zibal gateway rejected request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"] | components["schemas"]["ZibalGatewayErrorResponse"];
                    };
                };
                /** @description Missing or invalid Bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Wrong user role */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description User not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["NotFoundErrorResponse"];
                    };
                };
                /** @description Internal server error (database error, metadata serialization failure) */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
                /** @description Zibal gateway unreachable or returned error */
                502: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["BadGatewayErrorResponse"];
                    };
                };
                /** @description Zibal gateway not configured */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ServiceUnavailableErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/wallet/zibal/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Verify a Zibal payment and settle wallet balance
         * @description Verifies payment status with Zibal gateway and atomically updates wallet transaction status.
         *     If payment is successful (result=100), wallet balance is credited in the same transaction.
         *     Requires user status 'active'.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ZibalVerifyRequest"];
                };
            };
            responses: {
                /** @description Success or user status mismatch */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            transaction: components["schemas"]["WalletTransaction"];
                            wallet?: components["schemas"]["WalletBalance"];
                            gateway: {
                                [key: string]: unknown;
                            };
                        } | components["schemas"]["UserStatusErrorResponse"];
                    };
                };
                /** @description Request validation failed */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Missing or invalid Bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Payment verification failed (Zibal result != 100) */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            transaction: components["schemas"]["WalletTransaction"];
                            gateway: {
                                [key: string]: unknown;
                            };
                        };
                    };
                };
                /** @description Wrong user role */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Transaction not found for user */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "transaction not found"
                         *     }
                         */
                        "application/json": components["schemas"]["NotFoundErrorResponse"];
                    };
                };
                /** @description Transaction already finalized (status not 'pending') */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "transaction already updated"
                         *     }
                         */
                        "application/json": components["schemas"]["ConflictErrorResponse"];
                    };
                };
                /** @description Internal server error (database transaction failure) */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
                /** @description Zibal gateway unreachable or returned error */
                502: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["BadGatewayErrorResponse"];
                    };
                };
                /** @description Zibal gateway not configured */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ServiceUnavailableErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/wallet/balance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve current wallet balance
         * @description Returns current wallet balance for authenticated user. Returns balance=0 if wallet doesn't exist yet.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Success or user status mismatch */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "user_id": 1,
                         *       "balance": 50000,
                         *       "updated_at": "2024-01-15T10:30:00Z"
                         *     }
                         */
                        "application/json": components["schemas"]["WalletBalance"] | components["schemas"]["UserStatusErrorResponse"];
                    };
                };
                /** @description Missing or invalid Bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Wrong user role */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description User not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["NotFoundErrorResponse"];
                    };
                };
                /** @description Internal server error (database error) */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/wallet/transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List wallet transactions with filtering
         * @description Returns paginated list of wallet transactions for authenticated user with optional status and type filtering and sorting.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Filter by transaction status (optional). */
                    status?: "pending" | "success" | "failed";
                    /** @description Filter by transaction type (optional). */
                    type?: "deposit" | "withdrawal";
                    /** @description Sort by created_at timestamp (default desc) */
                    sort?: "asc" | "desc";
                    /** @description Page size (default 20, max 100) */
                    limit?: number;
                    /** @description Results offset for pagination (default 0) */
                    offset?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Success or user status mismatch */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            transactions: components["schemas"]["WalletTransaction"][];
                            meta: components["schemas"]["WalletTransactionsMeta"];
                        } | components["schemas"]["UserStatusErrorResponse"];
                    };
                };
                /** @description Invalid query parameters */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Key: 'walletTransactionsQuery.Limit' Error:Field validation for 'Limit' failed on the 'max' tag"
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Missing or invalid Bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Wrong user role */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description User not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["NotFoundErrorResponse"];
                    };
                };
                /** @description Internal server error (database error) */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/wallet/test/increase": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Test endpoint to increase wallet balance
         * @description **TEST ONLY**: Directly increases wallet balance by specified amount.
         *     Creates a deposit transaction with provider="test" for tracking.
         *     This endpoint is for testing and development purposes only.
         *     Requires user status 'active'.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "amount": 100000
                     *     }
                     */
                    "application/json": components["schemas"]["TestIncreaseWalletRequest"];
                };
            };
            responses: {
                /** @description Wallet balance increased successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "wallet": {
                         *         "user_id": 1,
                         *         "balance": 150000,
                         *         "updated_at": "2026-01-08T12:00:00Z"
                         *       },
                         *       "transaction": {
                         *         "id": 42,
                         *         "user_id": 1,
                         *         "amount": 100000,
                         *         "type": "deposit",
                         *         "status": "success",
                         *         "provider": "test",
                         *         "description": "Test deposit",
                         *         "created_at": "2026-01-08T12:00:00Z",
                         *         "updated_at": "2026-01-08T12:00:00Z"
                         *       },
                         *       "message": "Wallet balance increased successfully (TEST MODE)"
                         *     }
                         */
                        "application/json": components["schemas"]["TestIncreaseWalletResponse"];
                    };
                };
                /** @description Request validation failed */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Key: 'testIncreaseWalletRequest.Amount' Error:Field validation for 'Amount' failed on the 'gt' tag"
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Missing or invalid Bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Wrong user role */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description User not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["NotFoundErrorResponse"];
                    };
                };
                /** @description Internal server error (database transaction failure) */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/upload/user": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload user file (media or document)
         * @description Uploads a file (media or document) for the authenticated user.
         *     Requires user status 'active'. File is validated by SHA256 hash.
         *     Maximum file size: 100MB.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "multipart/form-data": {
                        /**
                         * Format: binary
                         * @description File to upload
                         */
                        file: string;
                        /**
                         * @description Type of file (media_type or doc_type)
                         * @enum {string}
                         */
                        file_type: "media_type" | "doc_type";
                        /** @description Required if file_type=media_type (img, pdf, video) */
                        media_type?: string;
                        /** @description Required if file_type=doc_type (national_id_card_photo_front, national_id_card_photo_back, birth_certificate_photo_first_page) */
                        doc_type?: string;
                        /** @description SHA256 hash of file for verification */
                        file_hash: string;
                    };
                };
            };
            responses: {
                /** @description Success or user status mismatch */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example ✅ file uploaded successfully */
                            message: string;
                            file_name: string;
                            /** Format: int64 */
                            file_size: number;
                            sha256: string;
                            media_type?: string | null;
                            doc_type?: string | null;
                            /** Format: date-time */
                            timestamp: string;
                        } | components["schemas"]["UserStatusErrorResponse"];
                    };
                };
                /** @description Request validation failed or file missing */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "multipart: NextPart: EOF"
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Missing or invalid Bearer token, or invalid file type */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "file type is not valid "
                         *     }
                         */
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Wrong user role */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description User not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["NotFoundErrorResponse"];
                    };
                };
                /** @description File size exceeds maximum limit (100MB) */
                413: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "file size exceeds limit"
                         *     }
                         */
                        "application/json": components["schemas"]["RequestEntityTooLargeErrorResponse"];
                    };
                };
                /** @description Internal server error (file system error, hash mismatch) */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "file hash mismatch"
                         *     }
                         */
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/upload/id_card": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload ID card photo or video for verification
         * @description Uploads an ID card photo or video for KYC verification.
         *
         *     **Profile prerequisites** — the user's profile must already have `national_code`,
         *     `birth_date`, and `serial_number` set (submitted via `/login/complete_user_info`).
         *     These values are read from the profile automatically and are NOT accepted in this request.
         *
         *     **Production mode**: for `id_card_photo`, the image is compared against the national
         *     card photo via Finnotech immediately. The response includes the final status
         *     (`verified` or `failed`). Service is unavailable daily 23:00–07:00.
         *
         *     **Development mode**: verification is simulated in the background after 10 seconds.
         *     Check `/user/me` for the result.
         *
         *     Maximum file size: 100MB.
         *     Supported formats — Photo: jpg, jpeg, png · Video: mp4, mov, avi
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "multipart/form-data": {
                        /**
                         * Format: binary
                         * @description Live face photo or video to compare against the national card
                         */
                        file: string;
                        /**
                         * @description Type of verification (photo or video)
                         * @enum {string}
                         */
                        verification_type: "id_card_photo" | "id_card_video";
                    };
                };
            };
            responses: {
                /** @description ID card uploaded and verified (or queued in dev mode) */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example ID card verified successfully */
                            message: string;
                            /**
                             * Format: int64
                             * @example 1
                             */
                            verification_id: number;
                            /** @enum {string} */
                            verification_type: "id_card_photo" | "id_card_video";
                            /** @example id_card.jpg */
                            file_name?: string;
                            /**
                             * Format: int64
                             * @example 1024000
                             */
                            file_size?: number;
                            /** @example abc123... */
                            file_hash?: string;
                            /**
                             * @example verified
                             * @enum {string}
                             */
                            status: "verified" | "pending";
                            /** @description Finnotech track ID (prod mode only) */
                            track_id?: string;
                            /**
                             * @description Present only in dev mode
                             * @example Verification will be processed within 10 seconds
                             */
                            note?: string;
                        };
                    };
                };
                /** @description Validation error (invalid file type or verification type) */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Missing or invalid Bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description File size exceeds maximum limit (100MB) */
                413: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "file size exceeds 100MB limit"
                         *     }
                         */
                        "application/json": components["schemas"]["RequestEntityTooLargeErrorResponse"];
                    };
                };
                /** @description Face does not match national card (prod mode) */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example عدم تطبیق تصویر چهره ورودی و تصویر مرجع! */
                            error?: string;
                            /** Format: int64 */
                            verification_id?: number;
                            verification_type?: string;
                            /** @example failed */
                            status?: string;
                            track_id?: string;
                        };
                    };
                };
                /** @description Internal server error (file system error) */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payment/zibal/callback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Frontend callback endpoint from Zibal
         * @description Public endpoint where Zibal redirects users after payment attempt.
         *     Returns echo of callback parameters. Frontend should use this to reconcile before calling verify endpoint.
         *     No authentication required.
         */
        get: {
            parameters: {
                query: {
                    /** @description Zibal track ID from payment redirect */
                    trackId: string;
                    /** @description Payment success flag ('1' = success, '0' = failure) */
                    success?: "0" | "1";
                    /** @description Optional message from Zibal */
                    message?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Echo of callback payload */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "track_id": "123456789",
                         *       "success": "1",
                         *       "message": "payment successful"
                         *     }
                         */
                        "application/json": {
                            /** @description Zibal track ID */
                            track_id: string;
                            /** @description Success flag ('0' or '1') */
                            success?: string;
                            /** @description Optional message from Zibal */
                            message?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/change_password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Change user password
         * @description Allows active users to change their password by providing the current password for validation.
         *     Requires user status 'active'.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "old_password": "oldpass123",
                     *       "new_password": "newsecurepass456"
                     *     }
                     */
                    "application/json": components["schemas"]["ChangePasswordRequest"];
                };
            };
            responses: {
                /** @description Password changed successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "user": {
                         *         "id": 1,
                         *         "mobile_number": "09123456789",
                         *         "first_name": "Ali",
                         *         "last_name": "Rezaei"
                         *       },
                         *       "status": "active"
                         *     }
                         */
                        "application/json": components["schemas"]["UserDataResponse"];
                    };
                };
                /** @description No password set */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "no password set"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Incorrect old password or authentication failed */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"] | components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get current user data
         * @description Returns full user profile information including status.
         *     Requires user status 'active'.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description User data retrieved successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "user": {
                         *         "id": 1,
                         *         "mobile_number": "09123456789",
                         *         "first_name": "Ali",
                         *         "last_name": "Rezaei",
                         *         "national_code": "1234567890",
                         *         "birth_date": "1990-05-15T00:00:00Z"
                         *       },
                         *       "status": "active",
                         *       "id_verification": {
                         *         "photo": {
                         *           "status": "verified",
                         *           "verified_at": "2026-01-08T10:30:00Z"
                         *         },
                         *         "video": {
                         *           "status": "pending"
                         *         }
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["UserDataResponse"];
                    };
                };
                /** @description Authentication failed */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Update user profile
         * @description Updates user profile information (name, national code, birth date).
         *     All fields are optional - only provided fields will be updated.
         *
         *     **Note:** To manage bank accounts/IBAN numbers, use the dedicated bank account endpoints.
         *
         *     Requires user status 'active'.
         */
        put: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UpdateProfileRequest"];
                };
            };
            responses: {
                /** @description Profile updated successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "user": {
                         *         "id": 1,
                         *         "mobile_number": "09123456789",
                         *         "first_name": "Mohammad",
                         *         "last_name": "Hosseini",
                         *         "national_code": "1234567890",
                         *         "birth_date": "1990-05-15T00:00:00Z"
                         *       },
                         *       "status": "active"
                         *     }
                         */
                        "application/json": components["schemas"]["UserDataResponse"];
                    };
                };
                /** @description Validation error or duplicate unique field */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Authentication failed */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bank_accounts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List user's bank accounts
         * @description Returns all bank accounts associated with the authenticated user.
         *     Each account includes auto-detected bank name and logo URL.
         *     Requires user status 'active'.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Bank accounts retrieved successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "accounts": [
                         *         {
                         *           "id": 1,
                         *           "user_id": 1,
                         *           "bank_name": "Bank Melli Iran",
                         *           "sheba_number": "820540102680020817909002",
                         *           "bank_code": "017",
                         *           "logo_url": "https://raw.githubusercontent.com/amastaneh/IranianBankLogos/master/resources/images/017.png",
                         *           "created_at": "2026-01-07T12:00:00Z",
                         *           "updated_at": "2026-01-07T12:00:00Z"
                         *         },
                         *         {
                         *           "id": 2,
                         *           "user_id": 1,
                         *           "bank_name": "Bank Saderat Iran",
                         *           "sheba_number": "193700701242447760000000",
                         *           "bank_code": "019",
                         *           "logo_url": "https://raw.githubusercontent.com/amastaneh/IranianBankLogos/master/resources/images/019.png",
                         *           "created_at": "2026-01-07T13:00:00Z",
                         *           "updated_at": "2026-01-07T13:00:00Z"
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": components["schemas"]["BankAccountListResponse"];
                    };
                };
                /** @description Authentication failed */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        /**
         * Add new bank account
         * @description Adds a new bank account (IBAN/Sheba number) for the authenticated user.
         *     Bank name is automatically detected from the sheba number.
         *     The sheba number will be normalized (IR prefix removed if present).
         *     Returns bank logo URL from IranianBankLogos repository.
         *     Requires user status 'active'.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "sheba_number": "IR820540102680020817909002"
                     *     }
                     */
                    "application/json": components["schemas"]["CreateBankAccountRequest"];
                };
            };
            responses: {
                /** @description Bank account created successfully */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "id": 1,
                         *       "user_id": 1,
                         *       "bank_name": "Bank Melli Iran",
                         *       "sheba_number": "820540102680020817909002",
                         *       "bank_code": "017",
                         *       "logo_url": "https://raw.githubusercontent.com/amastaneh/IranianBankLogos/master/resources/images/017.png",
                         *       "created_at": "2026-01-07T12:00:00Z",
                         *       "updated_at": "2026-01-07T12:00:00Z"
                         *     }
                         */
                        "application/json": components["schemas"]["BankAccount"];
                    };
                };
                /** @description Validation error */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Authentication failed */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bank_accounts/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Update bank account
         * @description Updates an existing bank account for the authenticated user.
         *     Bank name is automatically detected from the new sheba number.
         *     The sheba number will be normalized (IR prefix removed if present).
         *     Users can only update their own bank accounts.
         *     Requires user status 'active'.
         */
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Bank account ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "sheba_number": "IR120120000000123456789101"
                     *     }
                     */
                    "application/json": components["schemas"]["CreateBankAccountRequest"];
                };
            };
            responses: {
                /** @description Bank account updated successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "id": 1,
                         *       "user_id": 1,
                         *       "bank_name": "Bank Mellat",
                         *       "sheba_number": "120120000000123456789101",
                         *       "bank_code": "012",
                         *       "logo_url": "https://raw.githubusercontent.com/amastaneh/IranianBankLogos/master/resources/images/012.png",
                         *       "created_at": "2026-01-07T12:00:00Z",
                         *       "updated_at": "2026-01-08T15:30:00Z"
                         *     }
                         */
                        "application/json": components["schemas"]["BankAccount"];
                    };
                };
                /** @description Validation error */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Authentication failed */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Bank account not found or doesn't belong to user */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "bank account not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        post?: never;
        /**
         * Delete bank account
         * @description Deletes a bank account for the authenticated user.
         *     Users can only delete their own bank accounts.
         *     Requires user status 'active'.
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Bank account ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Bank account deleted successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "message": "bank account deleted successfully"
                         *     }
                         */
                        "application/json": {
                            message?: string;
                        };
                    };
                };
                /** @description Authentication failed */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Bank account not found or doesn't belong to user */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "bank account not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/projects": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all projects
         * @description Returns all real estate projects with optional filtering and sorting.
         *     This is a public endpoint — no authentication required.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Filter by project status */
                    status?: "finished" | "processing";
                    /** @description Field to sort by */
                    sort_by?: "name" | "created_at" | "most_popular";
                    /** @description Sort direction */
                    sort_direction?: "asc" | "desc";
                    /** @description Number of results per page */
                    limit?: number;
                    /** @description Number of results to skip */
                    offset?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Projects retrieved successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "projects": [
                         *         {
                         *           "project": {
                         *             "id": 1,
                         *             "name": "Tehran Tower Complex",
                         *             "address": "Vanak Square, Tehran",
                         *             "status": "processing",
                         *             "price": 5000000000,
                         *             "price_currency": "IRR",
                         *             "token_count": 1000,
                         *             "token_sold": 350,
                         *             "options": [
                         *               "elevator",
                         *               "parking",
                         *               "warehouse"
                         *             ],
                         *             "sale_price_per_meter": "50000000",
                         *             "token_price_toman": "5000000",
                         *             "price_per_meter_token": "10",
                         *             "estimated_profit_percentage": "25",
                         *             "token_id": 1,
                         *             "created_at": "2026-01-01T00:00:00Z",
                         *             "updated_at": "2026-01-07T00:00:00Z"
                         *           },
                         *           "media": [
                         *             {
                         *               "id": 1,
                         *               "project_id": 1,
                         *               "hash": "abc123...",
                         *               "path": "uploads/projects/1/building.jpg",
                         *               "name": "Building Exterior",
                         *               "media_type": "img",
                         *               "created_at": "2026-01-05T10:00:00Z"
                         *             },
                         *             {
                         *               "id": 2,
                         *               "project_id": 1,
                         *               "hash": "def456...",
                         *               "path": "uploads/projects/1/video.mp4",
                         *               "name": "Project Tour",
                         *               "media_type": "video",
                         *               "created_at": "2026-01-05T11:00:00Z"
                         *             }
                         *           ]
                         *         }
                         *       ],
                         *       "meta": {
                         *         "limit": 20,
                         *         "offset": 0,
                         *         "sort_by": "created_at",
                         *         "sort_direction": "desc"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ProjectListResponse"];
                    };
                };
                /** @description Invalid query parameters */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Authentication failed */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/projects/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get project by ID
         * @description Returns full details of a single project including its media files.
         *     This is a public endpoint — no authentication required.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Project ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Project details with media files */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "project": {
                         *         "id": 1,
                         *         "name": "Tehran Tower Complex",
                         *         "status": "processing",
                         *         "address": "Vanak Square, Tehran",
                         *         "location": "35.7456 51.4113",
                         *         "price": "5000000000",
                         *         "price_currency": "IRR",
                         *         "token_count": 1000,
                         *         "token_sold": 350,
                         *         "token_name": "Tehran Tower Token",
                         *         "start_time": "2026-01-01T00:00:00Z",
                         *         "dead_line": "2026-12-31",
                         *         "options": [
                         *           "elevator",
                         *           "parking"
                         *         ],
                         *         "description": "Luxury residential complex",
                         *         "contractor": "ABC Construction",
                         *         "sale_price_per_meter": "50000000",
                         *         "token_price_toman": "5000000",
                         *         "price_per_meter_token": "10",
                         *         "estimated_profit_percentage": "25",
                         *         "token_id": 1,
                         *         "created_at": "2026-01-01T00:00:00Z",
                         *         "updated_at": "2026-01-07T00:00:00Z"
                         *       },
                         *       "media": [
                         *         {
                         *           "id": 1,
                         *           "project_id": 1,
                         *           "hash": "abc123...",
                         *           "path": "uploads/projects/1/building.jpg",
                         *           "name": "Building Exterior",
                         *           "media_type": "img",
                         *           "created_at": "2026-01-05T10:00:00Z"
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": components["schemas"]["ProjectWithMedia"];
                    };
                };
                /** @description Invalid project ID */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Project not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example project not found */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/projects/mine": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List user's participated projects
         * @description Returns all projects the authenticated user has participated in.
         *     Requires user status 'active'.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description User's projects retrieved successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "projects": [
                         *         {
                         *           "project": {
                         *             "id": 1,
                         *             "name": "Tehran Tower Complex",
                         *             "status": "processing",
                         *             "sale_price_per_meter": "50000000",
                         *             "token_price_toman": "5000000",
                         *             "price_per_meter_token": "10",
                         *             "estimated_profit_percentage": "25",
                         *             "token_id": 1,
                         *             "created_at": "2026-01-01T00:00:00Z"
                         *           },
                         *           "media": [
                         *             {
                         *               "id": 1,
                         *               "project_id": 1,
                         *               "hash": "abc123...",
                         *               "path": "uploads/projects/1/building.jpg",
                         *               "name": "Building Exterior",
                         *               "media_type": "img",
                         *               "created_at": "2026-01-05T10:00:00Z"
                         *             }
                         *           ]
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": {
                            projects?: components["schemas"]["ProjectWithMedia"][];
                        };
                    };
                };
                /** @description Authentication failed */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tokens": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all available tokens
         * @description Returns all available project tokens with current prices.
         *     Requires user status 'active'.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Tokens retrieved successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "tokens": [
                         *         {
                         *           "id": 1,
                         *           "token_name": "Tehran Tower Token",
                         *           "project_id": 1,
                         *           "abbreviation": "TTT",
                         *           "price_per_token": 50000,
                         *           "created_at": "2026-01-01T00:00:00Z",
                         *           "updated_at": "2026-01-07T00:00:00Z"
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": components["schemas"]["TokenListResponse"];
                    };
                };
                /** @description Authentication failed */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tokens/mine": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List user's owned tokens from verified orders
         * @description Returns all tokens owned by the authenticated user from verified orders.
         *     Aggregates token amounts across all verified orders.
         *     Requires user status 'active'.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description User tokens retrieved successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "tokens": [
                         *         {
                         *           "id": 1,
                         *           "token_name": "Adrian-1",
                         *           "project_id": 1,
                         *           "abbreviation": "ADR1",
                         *           "price_per_token": 150000,
                         *           "amount": 10,
                         *           "created_at": "2026-01-05T00:00:00Z",
                         *           "updated_at": "2026-01-07T00:00:00Z"
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": components["schemas"]["UserTokenListResponse"];
                    };
                };
                /** @description Authentication failed */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List user's orders
         * @description Returns all orders for the authenticated user with profit/loss calculation.
         *     Profit is calculated as (current_price - purchase_price) * tokens_taken.
         *     Requires user status 'active'.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Filter by order status IDs (comma-separated).
                     *     Status mapping: 1=pending, 2=verified, 3=failed
                     *     Examples:
                     *     - "1" returns only pending orders
                     *     - "1,2" returns pending and verified orders
                     *     - "2,3" returns verified and failed orders
                     * @example 1,2
                     */
                    contains?: string;
                    /** @description Number of results per page */
                    limit?: number;
                    /** @description Number of results to skip */
                    offset?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Orders retrieved successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "orders": [
                         *         {
                         *           "order": {
                         *             "id": 1,
                         *             "user_id": 1,
                         *             "token_id": 1,
                         *             "amount_paid": 500000,
                         *             "token_amount": 10,
                         *             "price_per_token_at_purchase": 50000,
                         *             "status": "verified",
                         *             "created_at": "2026-01-07T12:00:00Z"
                         *           },
                         *           "amount_paid": 500000,
                         *           "tokens_taken": 10,
                         *           "purchase_price": 50000,
                         *           "current_price": 55000,
                         *           "profit": 50000
                         *         }
                         *       ],
                         *       "meta": {
                         *         "limit": 20,
                         *         "offset": 0
                         *       },
                         *       "summary": {
                         *         "total_paid": 500000,
                         *         "total_profit": 50000,
                         *         "total_current_value": 550000
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["OrderListResponse"];
                    };
                };
                /** @description Authentication failed */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        /**
         * Create token purchase order
         * @description Creates an order to purchase project tokens.
         *     Checks wallet balance and deducts the required amount atomically.
         *     Order status is randomly assigned (pending/verified/failed) for testing.
         *     Requires user status 'active'.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "token_id": 1,
                     *       "token_amount": 10
                     *     }
                     */
                    "application/json": components["schemas"]["CreateOrderRequest"];
                };
            };
            responses: {
                /** @description Order created successfully */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "id": 1,
                         *       "user_id": 1,
                         *       "token_id": 1,
                         *       "amount_paid": 500000,
                         *       "token_amount": 10,
                         *       "price_per_token_at_purchase": 50000,
                         *       "status": "verified",
                         *       "created_at": "2026-01-07T12:00:00Z",
                         *       "updated_at": "2026-01-07T12:00:00Z"
                         *     }
                         */
                        "application/json": components["schemas"]["Order"];
                    };
                };
                /** @description Validation error */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Authentication failed */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Insufficient wallet balance */
                402: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "insufficient balance",
                         *       "required": 500000,
                         *       "available": 300000,
                         *       "shortage": 200000
                         *     }
                         */
                        "application/json": components["schemas"]["InsufficientBalanceError"];
                    };
                };
                /** @description Token not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "token not found"
                         *     }
                         */
                        "application/json": components["schemas"]["NotFoundErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/withdrawals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create withdrawal request
         * @description Creates a withdrawal transaction request using a saved bank account.
         *     User must have a bank account saved before creating a withdrawal.
         *     Status is randomly assigned (pending/success/failed) for testing.
         *     Requires user status 'active'.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "amount": 100000,
                     *       "bank_account_id": 1,
                     *       "description": "Withdraw to personal account"
                     *     }
                     */
                    "application/json": components["schemas"]["CreateWithdrawalRequest"];
                };
            };
            responses: {
                /** @description Withdrawal request created successfully */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "transaction": {
                         *         "id": 1,
                         *         "user_id": 1,
                         *         "amount": 100000,
                         *         "type": "withdrawal",
                         *         "provider": "manual",
                         *         "description": "Withdraw to personal account",
                         *         "status": "pending",
                         *         "created_at": "2026-01-07T12:00:00Z"
                         *       },
                         *       "bank_account_id": 1,
                         *       "sheba_number": "820540102680020817909002",
                         *       "bank_name": "Bank Melli Iran"
                         *     }
                         */
                        "application/json": components["schemas"]["WithdrawalResponse"];
                    };
                };
                /** @description Validation error */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Authentication failed */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Bank account not found or doesn't belong to user */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "bank account not found"
                         *     }
                         */
                        "application/json": components["schemas"]["NotFoundErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Admin login
         * @description Authenticate admin user with username and password
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @example admin */
                        username: string;
                        /** @example Admin@123 */
                        password: string;
                    };
                };
            };
            responses: {
                /** @description Login successful */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            admin?: {
                                /** Format: int64 */
                                id?: number;
                                mobile_number?: string;
                                first_name?: string;
                                last_name?: string;
                                /** Format: date-time */
                                created_at?: string;
                                /** Format: date-time */
                                updated_at?: string;
                            };
                            /** @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... */
                            access_token?: string;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Invalid credentials */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example invalid credentials */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/verifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List ID verifications
         * @description List all user ID verifications with filtering and pagination
         */
        get: {
            parameters: {
                query?: {
                    /** @description Filter by user ID */
                    user_id?: number;
                    /** @description Filter by verification status */
                    status?: "pending" | "verified" | "failed";
                    /** @description Filter by verification type */
                    verification_type?: "id_card_photo" | "id_card_video";
                    /** @description Sort by field */
                    sort_by?: "created_at" | "status";
                    /** @description Sort direction */
                    sort_direction?: "asc" | "desc";
                    /** @description Number of items per page */
                    limit?: number;
                    /** @description Number of items to skip */
                    offset?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of verifications */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            verifications?: {
                                /** Format: int64 */
                                id?: number;
                                /** Format: int64 */
                                user_id?: number;
                                /** @enum {string} */
                                verification_type?: "id_card_photo" | "id_card_video";
                                file_path?: string;
                                file_hash?: string;
                                /** @enum {string} */
                                status?: "pending" | "verified" | "failed";
                                failure_reason?: string | null;
                                /** Format: date-time */
                                verified_at?: string | null;
                                /** Format: date-time */
                                created_at?: string;
                                /** Format: date-time */
                                updated_at?: string;
                            }[];
                            meta?: {
                                /** Format: int64 */
                                total?: number;
                                limit?: number;
                                offset?: number;
                                /** @description Current page number */
                                page?: number;
                                sort_by?: string;
                                sort_direction?: string;
                                status?: string | null;
                                verification_type?: string | null;
                            };
                        };
                    };
                };
                /** @description Invalid request parameters */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example admin access required */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/verifications/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get verification details
         * @description Get details of a specific ID verification
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Verification ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Verification details */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: int64 */
                            id?: number;
                            /** Format: int64 */
                            user_id?: number;
                            /** @enum {string} */
                            verification_type?: "id_card_photo" | "id_card_video";
                            file_path?: string;
                            file_hash?: string;
                            /** @enum {string} */
                            status?: "pending" | "verified" | "failed";
                            failure_reason?: string | null;
                            /** Format: date-time */
                            verified_at?: string | null;
                            /** Format: date-time */
                            created_at?: string;
                            /** Format: date-time */
                            updated_at?: string;
                        };
                    };
                };
                /** @description Invalid ID */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example admin access required */
                            error?: string;
                        };
                    };
                };
                /** @description Verification not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example verification not found */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/verifications/{id}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Approve verification
         * @description Approve a user's ID verification
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Verification ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Verification approved successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example verification approved successfully */
                            message?: string;
                            verification?: {
                                /** Format: int64 */
                                id?: number;
                                /** Format: int64 */
                                user_id?: number;
                                /** @enum {string} */
                                verification_type?: "id_card_photo" | "id_card_video";
                                file_path?: string;
                                file_hash?: string;
                                /** @example verified */
                                status?: string;
                                failure_reason?: string | null;
                                /** Format: date-time */
                                verified_at?: string;
                                /** Format: date-time */
                                created_at?: string;
                                /** Format: date-time */
                                updated_at?: string;
                            };
                        };
                    };
                };
                /** @description Invalid ID */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example admin access required */
                            error?: string;
                        };
                    };
                };
                /** @description Verification not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example verification not found */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/verifications/{id}/reject": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Reject verification
         * @description Reject a user's ID verification with a failure reason
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Verification ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @example Document is unclear or incomplete */
                        failure_reason: string;
                    };
                };
            };
            responses: {
                /** @description Verification rejected successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example verification rejected successfully */
                            message?: string;
                            verification?: {
                                /** Format: int64 */
                                id?: number;
                                /** Format: int64 */
                                user_id?: number;
                                /** @enum {string} */
                                verification_type?: "id_card_photo" | "id_card_video";
                                file_path?: string;
                                file_hash?: string;
                                /** @example failed */
                                status?: string;
                                /** @example Document is unclear or incomplete */
                                failure_reason?: string;
                                /** Format: date-time */
                                verified_at?: string | null;
                                /** Format: date-time */
                                created_at?: string;
                                /** Format: date-time */
                                updated_at?: string;
                            };
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example admin access required */
                            error?: string;
                        };
                    };
                };
                /** @description Verification not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example verification not found */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all users
         * @description List all users with filtering, sorting, and pagination
         */
        get: {
            parameters: {
                query?: {
                    /** @description Search by mobile number, first name, last name, or national code */
                    search?: string;
                    /** @description Filter by user status */
                    status?: "no_info" | "no_password" | "active" | "not_active" | "not_verified";
                    /** @description Sort by field */
                    sort_by?: "created_at" | "mobile_number" | "status";
                    /** @description Sort direction */
                    sort_direction?: "asc" | "desc";
                    /** @description Number of items per page */
                    limit?: number;
                    /** @description Number of items to skip */
                    offset?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of users with pagination metadata */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            users?: {
                                /** Format: int64 */
                                id?: number;
                                mobile_number?: string;
                                first_name?: string | null;
                                last_name?: string | null;
                                national_code?: string | null;
                                /** Format: date-time */
                                birth_date?: string | null;
                                /** @enum {string} */
                                status?: "no_info" | "no_password" | "active" | "not_active" | "not_verified";
                                /** Format: date-time */
                                created_at?: string;
                                /** Format: date-time */
                                updated_at?: string;
                            }[];
                            meta?: {
                                /** Format: int64 */
                                total?: number;
                                limit?: number;
                                offset?: number;
                                page?: number;
                                sort_by?: string;
                                sort_direction?: string;
                            };
                        };
                    };
                };
                /** @description Invalid query parameters */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/users/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get single user
         * @description Get detailed information about a specific user
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description User ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description User details */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: int64 */
                            id?: number;
                            mobile_number?: string;
                            first_name?: string | null;
                            last_name?: string | null;
                            national_code?: string | null;
                            /** Format: date-time */
                            birth_date?: string | null;
                            /** @enum {string} */
                            status?: "no_info" | "no_password" | "active" | "not_active" | "not_verified";
                            /** Format: date-time */
                            created_at?: string;
                            /** Format: date-time */
                            updated_at?: string;
                        };
                    };
                };
                /** @description Invalid user ID */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description User not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example user not found */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        /**
         * Update user
         * @description Update user information (same as PATCH)
         */
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description User ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "first_name": "Ali",
                     *       "last_name": "Rezaei",
                     *       "status": "active"
                     *     }
                     */
                    "application/json": {
                        first_name?: string | null;
                        last_name?: string | null;
                        national_code?: string | null;
                        /** Format: date-time */
                        birth_date?: string | null;
                        /** @enum {string|null} */
                        status?: "no_info" | "no_password" | "active" | "not_active" | "not_verified" | null;
                    };
                };
            };
            responses: {
                /** @description User updated successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: int64 */
                            id?: number;
                            mobile_number?: string;
                            first_name?: string | null;
                            last_name?: string | null;
                            national_code?: string | null;
                            /** Format: date-time */
                            birth_date?: string | null;
                            /** @enum {string} */
                            status?: "no_info" | "no_password" | "active" | "not_active" | "not_verified";
                            /** Format: date-time */
                            created_at?: string;
                            /** Format: date-time */
                            updated_at?: string;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description User not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example user not found */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        post?: never;
        /**
         * Delete user
         * @description Delete a user from the system
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description User ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description User deleted successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example user deleted successfully */
                            message?: string;
                        };
                    };
                };
                /** @description Invalid user ID */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        /**
         * Update user
         * @description Update user information
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description User ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "first_name": "Ali",
                     *       "last_name": "Rezaei",
                     *       "status": "active"
                     *     }
                     */
                    "application/json": {
                        first_name?: string | null;
                        last_name?: string | null;
                        national_code?: string | null;
                        /** Format: date-time */
                        birth_date?: string | null;
                        /** @enum {string|null} */
                        status?: "no_info" | "no_password" | "active" | "not_active" | "not_verified" | null;
                    };
                };
            };
            responses: {
                /** @description User updated successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: int64 */
                            id?: number;
                            mobile_number?: string;
                            first_name?: string | null;
                            last_name?: string | null;
                            national_code?: string | null;
                            /** Format: date-time */
                            birth_date?: string | null;
                            /** @enum {string} */
                            status?: "no_info" | "no_password" | "active" | "not_active" | "not_verified";
                            /** Format: date-time */
                            created_at?: string;
                            /** Format: date-time */
                            updated_at?: string;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description User not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example user not found */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/admin/projects": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all projects
         * @description List all projects with filtering, sorting, and pagination
         */
        get: {
            parameters: {
                query?: {
                    /** @description Search by project name */
                    search?: string;
                    /** @description Filter by project status */
                    status?: "finished" | "processing";
                    /** @description Sort by field */
                    sort_by?: "name" | "created_at" | "status";
                    /** @description Sort direction */
                    sort_direction?: "asc" | "desc";
                    /** @description Number of items per page */
                    limit?: number;
                    /** @description Number of items to skip */
                    offset?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of projects with pagination metadata */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            projects?: components["schemas"]["ProjectWithMedia"][];
                            meta?: {
                                /** Format: int64 */
                                total?: number;
                                limit?: number;
                                offset?: number;
                                page?: number;
                                sort_by?: string;
                                sort_direction?: string;
                            };
                        };
                    };
                };
                /** @description Invalid query parameters */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        /**
         * Create project
         * @description Create a new project
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @example Tehran Tower Complex */
                        name: string;
                        /**
                         * @example processing
                         * @enum {string}
                         */
                        status: "finished" | "processing";
                        /** @example Vanak Square, Tehran */
                        address: string;
                        /**
                         * @description Latitude and longitude separated by a space, e.g. '35.7456 51.4113'
                         * @example 35.7456 51.4113
                         */
                        location: string;
                        /** @example 5000000000 */
                        price: string;
                        /** @example IRR */
                        price_currency: string;
                        /**
                         * Format: int32
                         * @example 1000
                         */
                        token_count: number;
                        /**
                         * Format: int32
                         * @example 0
                         */
                        token_sold?: number;
                        /** @example Tehran Tower Token */
                        token_name: string;
                        /**
                         * Format: date
                         * @description Project start date in YYYY-MM-DD format
                         * @example 2026-01-01
                         */
                        start_time: string;
                        /**
                         * Format: date
                         * @description Project deadline in YYYY-MM-DD format
                         * @example 2026-12-31
                         */
                        dead_line: string;
                        /**
                         * @example [
                         *       "elevator",
                         *       "heating_system"
                         *     ]
                         */
                        options?: ("warehouse" | "heating_system" | "cooling_system" | "elevator" | "no_elevator_required")[];
                        /** @example Luxury residential complex */
                        description?: string | null;
                        /** @example ABC Construction */
                        contractor?: string | null;
                        /** @description قیمت فروش هر متر ملک - Sale price per square meter of property */
                        sale_price_per_meter?: string;
                        /** @description قیمت هر توکن به تومان - Price per token in Toman */
                        token_price_toman?: string;
                        /** @description قیمت هر متر به توکن - Price per meter in tokens */
                        price_per_meter_token?: string;
                        /** @description درصد سود پیش بینی پروژه - Estimated project profit percentage */
                        estimated_profit_percentage?: string;
                    };
                };
            };
            responses: {
                /** @description Project created successfully */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Project"];
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/projects/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get single project
         * @description Get detailed information about a specific project
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Project ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Project details with media files */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ProjectWithMedia"];
                    };
                };
                /** @description Invalid project ID */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Project not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example project not found */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        /**
         * Update project
         * @description Update project information (same as PATCH)
         */
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Project ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "status": "finished",
                     *       "token_sold": 500
                     *     }
                     */
                    "application/json": {
                        name?: string | null;
                        /** @enum {string|null} */
                        status?: "finished" | "processing" | null;
                        address?: string | null;
                        /**
                         * @description Latitude and longitude separated by a space, e.g. '35.7456 51.4113'
                         * @example 35.7456 51.4113
                         */
                        location?: string | null;
                        price?: string | null;
                        price_currency?: string | null;
                        /** Format: int32 */
                        token_count?: number | null;
                        /** Format: int32 */
                        token_sold?: number | null;
                        token_name?: string | null;
                        /**
                         * Format: date
                         * @description Project start date in YYYY-MM-DD format
                         * @example 2026-01-01
                         */
                        start_time?: string | null;
                        /**
                         * Format: date
                         * @description Project deadline in YYYY-MM-DD format
                         * @example 2026-12-31
                         */
                        dead_line?: string | null;
                        options?: ("warehouse" | "heating_system" | "cooling_system" | "elevator" | "no_elevator_required")[] | null;
                        description?: string | null;
                        contractor?: string | null;
                        /** @description قیمت فروش هر متر ملک - Sale price per square meter of property */
                        sale_price_per_meter?: string | null;
                        /** @description قیمت هر توکن به تومان - Price per token in Toman */
                        token_price_toman?: string | null;
                        /** @description قیمت هر متر به توکن - Price per meter in tokens */
                        price_per_meter_token?: string | null;
                        /** @description درصد سود پیش بینی پروژه - Estimated project profit percentage */
                        estimated_profit_percentage?: string | null;
                    };
                };
            };
            responses: {
                /** @description Project updated successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Project"];
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Project not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example project not found */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        post?: never;
        /**
         * Delete project
         * @description Delete a project from the system
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Project ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Project deleted successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example project deleted successfully */
                            message?: string;
                        };
                    };
                };
                /** @description Invalid project ID */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        /**
         * Update project
         * @description Update project information
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Project ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "status": "finished",
                     *       "token_sold": 500
                     *     }
                     */
                    "application/json": {
                        name?: string | null;
                        /** @enum {string|null} */
                        status?: "finished" | "processing" | null;
                        address?: string | null;
                        /**
                         * @description Latitude and longitude separated by a space, e.g. '35.7456 51.4113'
                         * @example 35.7456 51.4113
                         */
                        location?: string | null;
                        price?: string | null;
                        price_currency?: string | null;
                        /** Format: int32 */
                        token_count?: number | null;
                        /** Format: int32 */
                        token_sold?: number | null;
                        token_name?: string | null;
                        /**
                         * Format: date
                         * @description Project start date in YYYY-MM-DD format
                         * @example 2026-01-01
                         */
                        start_time?: string | null;
                        /**
                         * Format: date
                         * @description Project deadline in YYYY-MM-DD format
                         * @example 2026-12-31
                         */
                        dead_line?: string | null;
                        options?: ("warehouse" | "heating_system" | "cooling_system" | "elevator" | "no_elevator_required")[] | null;
                        description?: string | null;
                        contractor?: string | null;
                        /** @description قیمت فروش هر متر ملک - Sale price per square meter of property */
                        sale_price_per_meter?: string | null;
                        /** @description قیمت هر توکن به تومان - Price per token in Toman */
                        token_price_toman?: string | null;
                        /** @description قیمت هر متر به توکن - Price per meter in tokens */
                        price_per_meter_token?: string | null;
                        /** @description درصد سود پیش بینی پروژه - Estimated project profit percentage */
                        estimated_profit_percentage?: string | null;
                    };
                };
            };
            responses: {
                /** @description Project updated successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Project"];
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Project not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example project not found */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/admin/projects/{id}/media": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload project media
         * @description Upload media files (images, PDFs, videos, text documents, voice/audio) for a specific project.
         *     Files are validated for size (max 100MB) and type.
         *     Duplicate files (same SHA256 hash) are rejected.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Project ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "multipart/form-data": {
                        /**
                         * Format: binary
                         * @description The media file to upload
                         */
                        file: string;
                        /**
                         * @description Type of media file. Must match file extension:
                         *     - img: .jpg, .jpeg, .png, .gif, .webp, .bmp, .tiff, .tif, .svg, .ico, .heic, .heif, .avif
                         *     - pdf: .pdf
                         *     - video: .mp4, .mov, .avi, .mkv, .webm, .flv, .wmv, .m4v, .3gp, .ogv, .ts, .m2ts
                         *     - text: .txt, .md, .csv, .json, .xml, .html, .htm, .rtf, .doc, .docx, .odt
                         *     - voice: .mp3, .wav, .ogg, .aac, .flac, .m4a, .wma, .opus, .aiff, .amr
                         * @enum {string}
                         */
                        media_type: "img" | "pdf" | "video" | "text" | "voice";
                        /**
                         * @description Custom display name for the media file (e.g., "Building Exterior", "Floor Plan")
                         * @example Building Exterior View
                         */
                        name: string;
                    };
                };
            };
            responses: {
                /** @description Media uploaded successfully */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "message": "file uploaded successfully",
                         *       "media": {
                         *         "id": 1,
                         *         "project_id": 1,
                         *         "hash": "a3b2c1d4e5f6...",
                         *         "path": "uploads/projects/1/20260213_120000_building.jpg",
                         *         "name": "Building Exterior View",
                         *         "media_type": "img",
                         *         "created_at": "2026-02-13T12:00:00Z"
                         *       }
                         *     }
                         */
                        "application/json": {
                            /** @example file uploaded successfully */
                            message?: string;
                            media?: components["schemas"]["ProjectMedia"];
                        };
                    };
                };
                /** @description Invalid request (file too large, wrong type, validation error) */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error?: string;
                        };
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Project not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example project not found */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/tokens": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all tokens
         * @description List all tokens with filtering, sorting, and pagination
         */
        get: {
            parameters: {
                query?: {
                    /** @description Filter by project ID */
                    project_id?: number;
                    /** @description Search by token name or abbreviation */
                    search?: string;
                    /** @description Sort by field */
                    sort_by?: "token_name" | "created_at" | "price_per_token";
                    /** @description Sort direction */
                    sort_direction?: "asc" | "desc";
                    /** @description Number of items per page */
                    limit?: number;
                    /** @description Number of items to skip */
                    offset?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of tokens with sales statistics and pagination metadata */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "tokens": [
                         *         {
                         *           "id": 1,
                         *           "token_name": "Tehran Tower Token",
                         *           "project_id": 1,
                         *           "abbreviation": "TTT",
                         *           "price_per_token": 50000,
                         *           "total_supply": 1000,
                         *           "sold": 350,
                         *           "remaining": 650,
                         *           "created_at": "2026-01-01T00:00:00Z",
                         *           "updated_at": "2026-01-07T00:00:00Z"
                         *         },
                         *         {
                         *           "id": 2,
                         *           "token_name": "Shiraz Plaza Token",
                         *           "project_id": 2,
                         *           "abbreviation": "SPT",
                         *           "price_per_token": 75000,
                         *           "total_supply": 500,
                         *           "sold": 500,
                         *           "remaining": 0,
                         *           "created_at": "2026-01-02T00:00:00Z",
                         *           "updated_at": "2026-01-08T00:00:00Z"
                         *         }
                         *       ],
                         *       "meta": {
                         *         "total": 50,
                         *         "limit": 20,
                         *         "offset": 0,
                         *         "page": 1,
                         *         "sort_by": "created_at",
                         *         "sort_direction": "desc"
                         *       }
                         *     }
                         */
                        "application/json": {
                            tokens?: components["schemas"]["TokenWithStats"][];
                            meta?: {
                                /** Format: int64 */
                                total?: number;
                                limit?: number;
                                offset?: number;
                                page?: number;
                                sort_by?: string;
                                sort_direction?: string;
                            };
                        };
                    };
                };
                /** @description Invalid query parameters */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        /**
         * Create token
         * @description Create a new token for a project
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @example Tehran Tower Token */
                        token_name: string;
                        /**
                         * Format: int64
                         * @example 1
                         */
                        project_id: number;
                        /** @example TTT */
                        abbreviation: string;
                        /**
                         * Format: int64
                         * @example 50000
                         */
                        price_per_token: number;
                    };
                };
            };
            responses: {
                /** @description Token created successfully */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Token"];
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/tokens/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get single token
         * @description Get detailed information about a specific token
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Token ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Token details */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Token"];
                    };
                };
                /** @description Invalid token ID */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Token not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example token not found */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        /**
         * Update token
         * @description Update token information (same as PATCH)
         */
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Token ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "price_per_token": 55000
                     *     }
                     */
                    "application/json": {
                        token_name?: string | null;
                        /** Format: int64 */
                        project_id?: number | null;
                        abbreviation?: string | null;
                        /** Format: int64 */
                        price_per_token?: number | null;
                    };
                };
            };
            responses: {
                /** @description Token updated successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Token"];
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Token not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example token not found */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        post?: never;
        /**
         * Delete token
         * @description Delete a token from the system
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Token ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Token deleted successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example token deleted successfully */
                            message?: string;
                        };
                    };
                };
                /** @description Invalid token ID */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        /**
         * Update token
         * @description Update token information
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Token ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "price_per_token": 55000
                     *     }
                     */
                    "application/json": {
                        token_name?: string | null;
                        /** Format: int64 */
                        project_id?: number | null;
                        abbreviation?: string | null;
                        /** Format: int64 */
                        price_per_token?: number | null;
                    };
                };
            };
            responses: {
                /** @description Token updated successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Token"];
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Token not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example token not found */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/admin/orders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all orders
         * @description List all orders with filtering, sorting, and pagination
         */
        get: {
            parameters: {
                query?: {
                    /** @description Filter by user ID */
                    user_id?: number;
                    /** @description Filter by token ID */
                    token_id?: number;
                    /** @description Filter by order status */
                    status?: "pending" | "verified" | "failed";
                    /** @description Sort by field */
                    sort_by?: "created_at" | "amount_paid" | "status";
                    /** @description Sort direction */
                    sort_direction?: "asc" | "desc";
                    /** @description Number of items per page */
                    limit?: number;
                    /** @description Number of items to skip */
                    offset?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of orders with pagination metadata */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            orders?: components["schemas"]["Order"][];
                            meta?: {
                                /** Format: int64 */
                                total?: number;
                                limit?: number;
                                offset?: number;
                                page?: number;
                                sort_by?: string;
                                sort_direction?: string;
                            };
                        };
                    };
                };
                /** @description Invalid query parameters */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/orders/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get single order
         * @description Get detailed information about a specific order
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Order ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Order details */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Order"];
                    };
                };
                /** @description Invalid order ID */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Order not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example order not found */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/orders/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update order status
         * @description Update the status of an order
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Order ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * @description Order status values:
                         *     - `pending`: Order is awaiting verification
                         *     - `verified`: Order has been verified and processed
                         *     - `failed`: Order verification failed
                         * @example verified
                         * @enum {string}
                         */
                        status: "pending" | "verified" | "failed";
                    };
                };
            };
            responses: {
                /** @description Order status updated successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Order"];
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Order not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example order not found */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/admin/transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all transactions
         * @description List all wallet transactions with filtering, sorting, and pagination
         */
        get: {
            parameters: {
                query?: {
                    /** @description Filter by user ID */
                    user_id?: number;
                    /** @description Filter by transaction status */
                    status?: "pending" | "success" | "failed";
                    /** @description Filter by transaction type */
                    type?: "deposit" | "withdrawal";
                    /** @description Sort by field */
                    sort_by?: "created_at" | "amount";
                    /** @description Sort direction */
                    sort_direction?: "asc" | "desc";
                    /** @description Number of items per page */
                    limit?: number;
                    /** @description Number of items to skip */
                    offset?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of transactions with pagination metadata */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            transactions?: components["schemas"]["WalletTransaction"][];
                            meta?: {
                                /** Format: int64 */
                                total?: number;
                                limit?: number;
                                offset?: number;
                                page?: number;
                                sort_by?: string;
                                sort_direction?: string;
                            };
                        };
                    };
                };
                /** @description Invalid query parameters */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/transactions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get single transaction
         * @description Get detailed information about a specific wallet transaction
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Transaction ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Transaction details */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["WalletTransaction"];
                    };
                };
                /** @description Invalid transaction ID */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Transaction not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example transaction not found */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/transactions/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update transaction status
         * @description Update the status of a wallet transaction.
         *
         *     **Important:** When approving a withdrawal (changing status to 'success'),
         *     the user's wallet balance will be automatically decreased by the transaction amount.
         *     This operation is atomic and idempotent - balance is only decreased once even if
         *     the status is updated multiple times.
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Transaction ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * @description Transaction status values:
                         *     - `create_link`: Initial status when payment link is created
                         *     - `pending`: Payment is being processed
                         *     - `success`: Transaction completed successfully
                         *     - `failed`: Transaction failed
                         * @example success
                         * @enum {string}
                         */
                        status: "create_link" | "pending" | "success" | "failed";
                    };
                };
            };
            responses: {
                /** @description Transaction status updated successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["WalletTransaction"];
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Transaction not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example transaction not found */
                            error?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/admin/bank_accounts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all bank accounts
         * @description List all bank accounts with filtering and pagination
         */
        get: {
            parameters: {
                query?: {
                    /** @description Filter by user ID */
                    user_id?: number;
                    /** @description Number of items per page */
                    limit?: number;
                    /** @description Number of items to skip */
                    offset?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of bank accounts with pagination metadata */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            accounts?: components["schemas"]["BankAccount"][];
                            meta?: {
                                /** Format: int64 */
                                total?: number;
                                limit?: number;
                                offset?: number;
                                page?: number;
                            };
                        };
                    };
                };
                /** @description Invalid query parameters */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/bank_accounts/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete bank account
         * @description Delete a bank account from the system
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Bank account ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Bank account deleted successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example bank account deleted successfully */
                            message?: string;
                        };
                    };
                };
                /** @description Invalid bank account ID */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/seed/media": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Seed project media with picsum images
         * @description Clears all existing media records from `users.media`, `users.document`,
         *     `projects.media`, and `projects.document`, then downloads **3 images**
         *     from [picsum.photos](https://picsum.photos) for every project and stores
         *     them under `uploads/projects/{id}/`.
         *
         *     Images are fetched with deterministic seeds so the same images are
         *     re-downloaded on repeated calls:
         *     - `image_1.jpg` (1200×800) — تصویر اصلی
         *     - `image_2.jpg` (800×600)  — نمای بیرونی
         *     - `image_3.jpg` (1000×700) — نمای داخلی
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Media seeded successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example project media seeded */
                            message?: string;
                            results?: {
                                /**
                                 * Format: int64
                                 * @example 1
                                 */
                                project_id?: number;
                                /**
                                 * @example [
                                 *       "uploads/projects/1/image_1.jpg",
                                 *       "uploads/projects/1/image_2.jpg",
                                 *       "uploads/projects/1/image_3.jpg"
                                 *     ]
                                 */
                                files?: string[];
                                /**
                                 * @description Present only when this project failed
                                 * @example
                                 */
                                error?: string;
                            }[];
                        };
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/reset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Reset all data (keep admins & migrations)
         * @description **Destructive — use with caution.**
         *
         *     Deletes every row from the following tables in FK-safe order:
         *
         *     `order` → `user_token` → `wallet_transaction` → `wallet` →
         *     `users.document` → `users.media` → `bank_account` →
         *     `id_verification` → `user_project` → `projects.document` →
         *     `projects.media` → `token` → `project` → `user`
         *
         *     The `admin` table and `schema_migrations` are **not** touched.
         *     The `uploads/projects/` and `uploads/users/` directories are also removed.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Reset completed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example all data reset; admins and migrations preserved */
                            message?: string;
                        };
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Admin access required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ForbiddenErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/test/generate-data": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Generate fake test data for user
         * @description Generates comprehensive fake test data for the authenticated user to populate list APIs.
         *     This is a development/testing endpoint that creates:
         *     - 100 bank accounts with valid SHEBA numbers
         *     - 2 ID verifications (photo and video)
         *     - Up to 100 project associations
         *     - Project media attachments (test images and videos) for each project
         *     - 100 orders with random statuses (pending, verified, failed)
         *     - 5 wallet transactions
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Test data generated successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "message": "Test data generated successfully",
                         *       "data": {
                         *         "bank_accounts": 100,
                         *         "id_verifications": 2,
                         *         "user_projects": 100,
                         *         "orders": 100,
                         *         "transactions": 5,
                         *         "user_tokens": 3,
                         *         "project_media": 200
                         *       }
                         *     }
                         */
                        "application/json": {
                            /** @example Test data generated successfully */
                            message?: string;
                            data?: {
                                /**
                                 * @description Number of bank accounts created
                                 * @example 100
                                 */
                                bank_accounts?: number;
                                /**
                                 * @description Number of ID verifications created
                                 * @example 2
                                 */
                                id_verifications?: number;
                                /**
                                 * @description Number of project associations created
                                 * @example 100
                                 */
                                user_projects?: number;
                                /**
                                 * @description Number of orders created
                                 * @example 100
                                 */
                                orders?: number;
                                /**
                                 * @description Number of wallet transactions created
                                 * @example 5
                                 */
                                transactions?: number;
                                /**
                                 * @description Number of user token records created
                                 * @example 3
                                 */
                                user_tokens?: number;
                                /**
                                 * @description Number of project media files created (test images and videos)
                                 * @example 200
                                 */
                                project_media?: number;
                            };
                        };
                    };
                };
                /** @description Unauthorized - invalid or missing token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UnauthorizedErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InternalServerErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @description Generic error wrapper returned for most error conditions. */
        ErrorResponse: {
            /**
             * @description Human-readable error message
             * @example validation failed: mobile_number is required
             */
            error: string;
        };
        /** @description Returned when request validation fails (400 Bad Request). */
        ValidationErrorResponse: {
            /**
             * @description Validation error details
             * @example Key: 'LoginWithMobileRequest.MobileNumber' Error:Field validation for 'MobileNumber' failed on the 'required' tag
             */
            error: string;
        };
        /**
         * @description Returned when authentication fails (401 Unauthorized).
         *     Common causes: missing/invalid Bearer token, expired token, malformed Authorization header.
         */
        UnauthorizedErrorResponse: {
            /**
             * @description Authentication/authorization error
             * @example invalid authorization header format
             */
            error: string;
        };
        /**
         * @description Returned when user lacks required role or status (403 Forbidden).
         *     Common causes: wrong user role, user status mismatch (e.g., active user accessing no_info endpoint).
         */
        ForbiddenErrorResponse: {
            /**
             * @description Permission denied message
             * @example permission denied!
             */
            error: string;
        };
        /**
         * @description Returned with HTTP 200 when user status doesn't match the required status for the resource.
         *     Client should check the 'status' field and redirect user based on 'user_status':
         *     - 'no_info': redirect to complete profile
         *     - 'no_password': redirect to register password
         *     - 'not_active': user account has been deactivated by admin
         *     - 'not_verified': user identity verification is pending admin approval
         *     - Other mismatches: show permission denied message
         */
        UserStatusErrorResponse: {
            /**
             * @description Response status indicator
             * @example error
             * @enum {string}
             */
            status: "error";
            /**
             * @description Current user status
             * @example no_info
             * @enum {string}
             */
            user_status: "no_info" | "no_password" | "active" | "not_active" | "not_verified";
            /**
             * @description Required user status to access this resource
             * @example active
             * @enum {string}
             */
            required_status: "no_info" | "no_password" | "active" | "not_active" | "not_verified";
            /**
             * @description Human-readable error message
             * @example profile information required
             */
            message: string;
        };
        /**
         * @description Returned when the user account is blocked by the admin. Two distinct HTTP status codes are used:
         *     - HTTP 403 Forbidden + user_status "not_active": account deactivated — message: "user is not active"
         *     - HTTP 423 Locked  + user_status "not_verified": pending identity verification — message: "user verification is pending"
         */
        UserBlockedErrorResponse: {
            /**
             * @example error
             * @enum {string}
             */
            status: "error";
            /**
             * @description The blocking status of the user
             * @example not_active
             * @enum {string}
             */
            user_status: "not_active" | "not_verified";
            /**
             * @description Human-readable reason for the block
             * @example user is not active
             */
            message: string;
        };
        /**
         * @description Returned with HTTP 409 Conflict when a unique constraint is violated.
         *     Possible values for 'field': "national code", "serial number", "sheba number", "mobile number"
         */
        DuplicateFieldErrorResponse: {
            /**
             * @description Short error label
             * @example duplicate value
             */
            error: string;
            /**
             * @description The user-friendly field name that caused the conflict
             * @example serial number
             */
            field: string;
            /**
             * @description Human-readable conflict message
             * @example serial number already exists
             */
            message: string;
        };
        /**
         * @description Returned when requested resource does not exist (404 Not Found).
         *     Common causes: transaction not found, user not found.
         */
        NotFoundErrorResponse: {
            /**
             * @description Resource not found message
             * @example transaction not found
             */
            error: string;
        };
        /**
         * @description Returned when operation conflicts with current state (409 Conflict).
         *     Common causes: transaction already processed, duplicate resource creation.
         */
        ConflictErrorResponse: {
            /**
             * @description Conflict description
             * @example transaction already updated
             */
            error: string;
        };
        /** @description Returned when payment gateway reports failure (402 Payment Required). */
        PaymentRequiredErrorResponse: {
            /**
             * @description Payment failure message
             * @example payment verification failed
             */
            error: string;
        };
        /**
         * @description Returned when uploaded file exceeds size limit (413 Request Entity Too Large).
         *     Maximum file size is 100MB.
         */
        RequestEntityTooLargeErrorResponse: {
            /**
             * @description File size error
             * @example file size exceeds limit
             */
            error: string;
        };
        /**
         * @description Returned for unexpected server errors (500 Internal Server Error).
         *     Common causes: database errors, SMS service failures, token generation failures, file system errors.
         */
        InternalServerErrorResponse: {
            /**
             * @description Internal server error details
             * @example database connection failed
             */
            error: string;
        };
        /** @description Returned when external service (Zibal, Finnotech, SMS) is unreachable or returns error (502 Bad Gateway). */
        BadGatewayErrorResponse: {
            /**
             * @description External service error
             * @example finnotech API returned status 502 Bad Gateway
             */
            error: string;
        };
        /** @description Returned when required service is not configured or unavailable (503 Service Unavailable). */
        ServiceUnavailableErrorResponse: {
            /**
             * @description Service unavailable message
             * @example zibal gateway is not configured
             */
            error: string;
        };
        /**
         * @description Returned when Zibal gateway rejects payment request (400 Bad Request).
         *     Result code 100 indicates success; any other code indicates failure.
         */
        ZibalGatewayErrorResponse: {
            /**
             * @description Zibal gateway result code (100 = success, others = failure)
             * @example 102
             */
            result: number;
            /**
             * @description Zibal gateway error message
             * @example merchant not found
             */
            message: string;
        };
        /** @description Returned when Finnotech IBAN verification fails (400 Bad Request). */
        FinnotechVerificationErrorResponse: {
            /**
             * @description Verification failure message
             * @example iban ownership verification failed
             */
            error: string;
            /** @description Finnotech tracking ID */
            trackId?: string | null;
            /** @description Verification status (DONE, FAILED) */
            status?: string | null;
        };
        /** @description Submit a mobile number to start OTP login or request a password-reset OTP. */
        LoginWithMobileRequest: {
            /** @example 09123456789 */
            mobile_number: string;
            /**
             * @description When true, sends a forgot-password OTP (TTL 3 minutes) instead of a login OTP.
             *     The user must already exist; returns 400 if the mobile number is not registered.
             * @default false
             */
            forgot_password: boolean;
        };
        /** @description Echo of the mobile number upon successful OTP dispatch. */
        LoginWithMobileResponse: {
            /** @example 09123456789 */
            mobile_number: string;
        };
        /** @description Submit the OTP received by SMS. Accepts test OTP "------" for development. */
        SendOTPCodeRequest: {
            /** @example 09123456789 */
            mobile_number: string;
            /** @example 123456 */
            otp_code: string;
        };
        /** @description Login with mobile number and password. Returns the same response as OTP login. */
        LoginWithPasswordRequest: {
            /** @example 09123456789 */
            mobile_number: string;
            /** @example mypassword123 */
            password: string;
        };
        /**
         * @description Reset a forgotten password using the OTP received via the forgot-password flow.
         *     The OTP expires after 3 minutes.
         */
        ResetPasswordRequest: {
            /** @example 09123456789 */
            mobile_number: string;
            /** @example 654321 */
            otp_code: string;
            /** @example newpassword123 */
            new_password: string;
        };
        UserResponse: {
            /** Format: int64 */
            id: number;
            mobile_number: string;
            first_name?: string | null;
            last_name?: string | null;
            national_code?: string | null;
            /** Format: date-time */
            birth_date?: string | null;
        };
        LoginResponse: {
            user: components["schemas"]["UserResponse"];
            /** @description Present only after OTP verification. */
            access_token?: string;
            /**
             * @description User's current status in the registration flow.
             * @example active
             * @enum {string}
             */
            status: "no_info" | "no_password" | "active" | "not_active" | "not_verified";
            /** @description ID verification status for both photo and video uploads */
            id_verification: {
                photo?: {
                    /**
                     * @description Status of ID card photo verification
                     * @enum {string}
                     */
                    status?: "pending" | "verified" | "failed";
                    /** @description Reason for failure (only present if status is 'failed') */
                    failure_reason?: string | null;
                    /**
                     * Format: date-time
                     * @description Timestamp when verified (only present if status is 'verified')
                     */
                    verified_at?: string | null;
                };
                video?: {
                    /**
                     * @description Status of ID card video verification
                     * @enum {string}
                     */
                    status?: "pending" | "verified" | "failed";
                    /** @description Reason for failure (only present if status is 'failed') */
                    failure_reason?: string | null;
                    /**
                     * Format: date-time
                     * @description Timestamp when verified (only present if status is 'verified')
                     */
                    verified_at?: string | null;
                };
            };
        };
        /** @description User ID is automatically taken from JWT authentication token. */
        CompleteUserInfoRequest: {
            first_name: string;
            last_name: string;
            /** @description National ID number. Must be unique across all users. */
            national_code: string;
            /**
             * @description Serial number on the back of the smart national card (or tracking code of paper receipt). Must be unique. Cannot be changed after submission.
             * @example 9R11209907
             */
            serial_number: string;
            /** @description IBAN (Sheba) number. If 3 characters long, Finnotech validation is skipped for testing. */
            sheba_number: string;
            /**
             * @description Gregorian date in yyyy/MM/dd format. Converted to Persian calendar internally for Finnotech verification.
             * @example 1990/05/15
             */
            birth_date: string;
        };
        /** @description User ID is automatically taken from JWT authentication token. */
        RegisterPasswordRequest: {
            /** Format: password */
            password: string;
        };
        ZibalPaymentRequest: {
            /**
             * Format: int64
             * @description Amount in IRR.
             */
            amount: number;
            description?: string;
            /** @description Optional override for payer mobile. */
            mobile?: string;
            order_id?: string;
        };
        ZibalPaymentResponse: {
            /** Format: int64 */
            track_id: number;
            /** Format: uri */
            payment_url: string;
            result: number;
            message: string;
            gateway_message?: string;
            /** Format: int64 */
            transaction_id: number;
        };
        ZibalVerifyRequest: {
            /** Format: int64 */
            track_id: number;
        };
        WalletTransaction: {
            /** Format: int64 */
            id: number;
            /** Format: int64 */
            user_id: number;
            /** Format: int64 */
            amount: number;
            /** @enum {string} */
            status: "pending" | "success" | "failed";
            /**
             * @description Transaction type - deposit (incoming funds) or withdrawal (outgoing funds)
             * @enum {string}
             */
            type: "deposit" | "withdrawal";
            provider: string;
            /** Format: int64 */
            provider_track_id?: number | null;
            provider_ref_number?: string | null;
            description?: string | null;
            provider_message?: string | null;
            metadata: {
                [key: string]: unknown;
            };
            /** Format: date-time */
            created_at: string;
            /** Format: date-time */
            updated_at: string;
        };
        WalletBalance: {
            /** Format: int64 */
            user_id: number;
            /** Format: int64 */
            balance: number;
            /** Format: date-time */
            updated_at?: string;
        };
        WalletTransactionsMeta: {
            limit: number;
            offset: number;
            /** @enum {string} */
            sort: "asc" | "desc";
            /** @enum {string|null} */
            status?: "pending" | "success" | "failed" | null;
            /**
             * @description Filter transactions by type
             * @enum {string|null}
             */
            type?: "deposit" | "withdrawal" | null;
        };
        BankAccount: {
            /** Format: int64 */
            id: number;
            /** Format: int64 */
            user_id: number;
            /**
             * @description Auto-detected English bank name from sheba number
             * @example Bank Melli Iran
             */
            bank_name: string;
            /**
             * @description Normalized sheba number (without IR prefix)
             * @example 820540102680020817909002
             */
            sheba_number: string;
            /**
             * @description Three-digit bank code extracted from sheba number
             * @example 017
             */
            bank_code: string;
            /**
             * @description URL to bank logo image served from the server
             * @example http://localhost:8080/public/images/banks/bmi.png
             */
            logo_url: string;
            /** Format: date-time */
            created_at?: string;
            /** Format: date-time */
            updated_at?: string;
        };
        CreateBankAccountRequest: {
            /**
             * @description Sheba/IBAN number (with or without IR prefix). Bank name will be auto-detected.
             * @example IR820540102680020817909002
             */
            sheba_number: string;
        };
        BankAccountListResponse: {
            accounts: components["schemas"]["BankAccount"][];
        };
        Project: {
            /** Format: int64 */
            id: number;
            /** @example Tehran Tower Complex */
            name: string;
            address?: string | null;
            /**
             * @description Latitude and longitude separated by a space, e.g. '35.7456 51.4113'
             * @example 35.7456 51.4113
             */
            location?: string | null;
            /** @enum {string} */
            status: "finished" | "processing";
            /**
             * @description Price in English digits only
             * @example 5000000000
             */
            price?: string | null;
            price_currency?: string | null;
            /** Format: int64 */
            token_count?: number | null;
            /** Format: int64 */
            token_sold?: number | null;
            token_name?: string | null;
            /**
             * Format: date-time
             * @description Project start date (stored as UTC timestamp)
             */
            start_time?: string | null;
            /**
             * Format: date
             * @description Project deadline in YYYY-MM-DD format
             * @example 2026-12-31
             */
            dead_line?: string | null;
            options?: ("warehouse" | "heating_system" | "cooling_system" | "elevator" | "no_elevator_required")[] | null;
            description?: string | null;
            contractor?: string | null;
            /**
             * @description قیمت فروش هر متر ملک - Sale price per square meter of property
             * @default 0
             */
            sale_price_per_meter: string;
            /**
             * @description قیمت هر توکن به تومان - Price per token in Toman
             * @default 0
             */
            token_price_toman: string;
            /**
             * @description قیمت هر متر به توکن - Price per meter in tokens
             * @default 0
             */
            price_per_meter_token: string;
            /**
             * @description درصد سود پیش بینی پروژه - Estimated project profit percentage
             * @default 0
             */
            estimated_profit_percentage: string;
            /**
             * Format: int64
             * @description ID of the associated token (one-to-one relationship)
             */
            token_id?: number | null;
            /** Format: date-time */
            created_at?: string;
            /** Format: date-time */
            updated_at?: string;
        };
        ProjectMedia: {
            /** Format: int64 */
            id: number;
            /** Format: int64 */
            project_id: number;
            /**
             * @description SHA256 hash of the file
             * @example a3b2c1...
             */
            hash: string;
            /**
             * @description Relative path to the media file
             * @example uploads/projects/1/image.jpg
             */
            path: string;
            /**
             * @description Display name of the media file
             * @example Building Exterior
             */
            name: string;
            /**
             * @description Type of media file
             * @enum {string}
             */
            media_type: "img" | "pdf" | "video";
            /** Format: date-time */
            created_at: string;
        };
        ProjectWithMedia: {
            project: components["schemas"]["Project"];
            /** @description Media files associated with the project (empty array if none) */
            media: components["schemas"]["ProjectMedia"][];
        };
        ProjectListResponse: {
            projects: components["schemas"]["ProjectWithMedia"][];
            meta: {
                limit?: number;
                offset?: number;
                /** @enum {string} */
                sort_by?: "name" | "created_at" | "most_popular";
                /** @enum {string} */
                sort_direction?: "asc" | "desc";
            };
        };
        Token: {
            /** Format: int64 */
            id: number;
            /** @example Tehran Tower Token */
            token_name: string;
            /** Format: int64 */
            project_id: number;
            /** @example TTT */
            abbreviation: string;
            /**
             * Format: int64
             * @description Price in smallest currency unit
             * @example 50000
             */
            price_per_token: number;
            /** Format: date-time */
            created_at?: string;
            /** Format: date-time */
            updated_at?: string;
        };
        TokenWithStats: {
            /** Format: int64 */
            id: number;
            /** @example Tehran Tower Token */
            token_name: string;
            /** Format: int64 */
            project_id: number;
            /** @example TTT */
            abbreviation: string;
            /**
             * Format: int64
             * @description Price in smallest currency unit
             * @example 50000
             */
            price_per_token: number;
            /**
             * Format: int64
             * @description Total number of tokens available (from project)
             * @example 1000
             */
            total_supply: number;
            /**
             * Format: int64
             * @description Number of tokens sold (from verified orders)
             * @example 350
             */
            sold: number;
            /**
             * Format: int64
             * @description Number of tokens remaining (total_supply - sold)
             * @example 650
             */
            remaining: number;
            /** Format: date-time */
            created_at?: string;
            /** Format: date-time */
            updated_at?: string;
        };
        TokenListResponse: {
            tokens: components["schemas"]["Token"][];
        };
        UserToken: {
            /**
             * Format: int64
             * @description Token ID
             */
            id: number;
            /** @description Token name */
            token_name: string;
            /**
             * Format: int64
             * @description Associated project ID
             */
            project_id: number;
            /** @description Token abbreviation */
            abbreviation: string;
            /**
             * Format: int64
             * @description Current price per token
             */
            price_per_token: number;
            /**
             * Format: int64
             * @description Total number of tokens owned from verified orders
             */
            amount: number;
            /** Format: date-time */
            created_at?: string;
            /** Format: date-time */
            updated_at?: string;
        };
        UserTokenListResponse: {
            tokens: components["schemas"]["UserToken"][];
        };
        Order: {
            /** Format: int64 */
            id: number;
            /** Format: int64 */
            user_id: number;
            /** Format: int64 */
            token_id: number;
            /**
             * Format: int64
             * @description Total amount paid in smallest currency unit
             */
            amount_paid: number;
            /**
             * Format: int64
             * @description Number of tokens purchased
             */
            token_amount: number;
            /**
             * Format: int64
             * @description Token price at time of purchase
             */
            price_per_token_at_purchase: number;
            /** @enum {string} */
            status: "pending" | "verified" | "failed";
            /** Format: date-time */
            created_at?: string;
            /** Format: date-time */
            updated_at?: string;
        };
        CreateOrderRequest: {
            /**
             * Format: int64
             * @example 1
             */
            token_id: number;
            /**
             * Format: int64
             * @example 10
             */
            token_amount: number;
        };
        OrderWithMetadata: {
            order: components["schemas"]["Order"];
            /**
             * Format: int64
             * @description Total amount paid
             */
            amount_paid: number;
            /**
             * Format: int64
             * @description Number of tokens purchased
             */
            tokens_taken: number;
            /**
             * Format: int64
             * @description Price per token at purchase
             */
            purchase_price: number;
            /**
             * Format: int64
             * @description Current price per token
             */
            current_price: number;
            /**
             * Format: int64
             * @description Total profit (current_price - purchase_price) * tokens_taken
             */
            profit: number;
        };
        OrderListResponse: {
            orders: components["schemas"]["OrderWithMetadata"][];
            meta: {
                limit?: number;
                offset?: number;
            };
            summary: {
                /**
                 * Format: int64
                 * @description Total amount paid across all orders
                 */
                total_paid?: number;
                /**
                 * Format: int64
                 * @description Total profit across all orders
                 */
                total_profit?: number;
                /**
                 * Format: int64
                 * @description Total current value (total_paid + total_profit)
                 */
                total_current_value?: number;
            };
        };
        InsufficientBalanceError: {
            /** @example insufficient balance */
            error: string;
            /**
             * Format: int64
             * @description Amount required for purchase
             */
            required: number;
            /**
             * Format: int64
             * @description Current wallet balance
             */
            available: number;
            /**
             * Format: int64
             * @description Amount short
             */
            shortage: number;
        };
        CreateWithdrawalRequest: {
            /**
             * Format: int64
             * @description Amount to withdraw
             * @example 100000
             */
            amount: number;
            /**
             * Format: int64
             * @description ID of the bank account to withdraw to
             * @example 1
             */
            bank_account_id: number;
            /** @example Withdraw to personal account */
            description?: string;
        };
        WithdrawalResponse: {
            transaction: components["schemas"]["WalletTransaction"];
            /**
             * Format: int64
             * @description Bank account ID used for withdrawal
             */
            bank_account_id: number;
            /** @description Sheba number from the selected bank account */
            sheba_number: string;
            /** @description Bank name from the selected bank account */
            bank_name: string;
        };
        ChangePasswordRequest: {
            /** @example oldpassword123 */
            old_password: string;
            /** @example newpassword456 */
            new_password: string;
        };
        /** @description All fields are optional. Only provided fields will be updated. Use bank account endpoints to manage IBAN/Sheba numbers. */
        UpdateProfileRequest: {
            /** @example Ali */
            first_name?: string | null;
            /** @example Rezaei */
            last_name?: string | null;
            /** @example 1234567890 */
            national_code?: string | null;
            /**
             * Format: date
             * @description Gregorian calendar date in yyyy/MM/dd format
             * @example 1990/05/15
             */
            birth_date?: string | null;
        };
        UserDataResponse: {
            user: components["schemas"]["UserResponse"];
            /** @enum {string} */
            status: "no_info" | "no_password" | "active" | "not_active" | "not_verified";
            /** @description ID verification status for both photo and video uploads */
            id_verification: {
                photo?: {
                    /**
                     * @description Status of ID card photo verification
                     * @enum {string}
                     */
                    status?: "pending" | "verified" | "failed";
                    /** @description Reason for failure (only present if status is 'failed') */
                    failure_reason?: string | null;
                    /**
                     * Format: date-time
                     * @description Timestamp when verified (only present if status is 'verified')
                     */
                    verified_at?: string | null;
                };
                video?: {
                    /**
                     * @description Status of ID card video verification
                     * @enum {string}
                     */
                    status?: "pending" | "verified" | "failed";
                    /** @description Reason for failure (only present if status is 'failed') */
                    failure_reason?: string | null;
                    /**
                     * Format: date-time
                     * @description Timestamp when verified (only present if status is 'verified')
                     */
                    verified_at?: string | null;
                };
            };
        };
        /** @description Test endpoint request to increase wallet balance */
        TestIncreaseWalletRequest: {
            /**
             * Format: int64
             * @description Amount to add to wallet (for testing purposes)
             * @example 100000
             */
            amount: number;
        };
        /** @description Response from test wallet increase endpoint */
        TestIncreaseWalletResponse: {
            wallet: components["schemas"]["WalletBalance"];
            transaction: components["schemas"]["WalletTransaction"];
            /** @example Wallet balance increased successfully (TEST MODE) */
            message: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
