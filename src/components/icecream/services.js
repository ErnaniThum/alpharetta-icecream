module.exports = (axios) => {
  const createRequest = () => {
    return request = axios.create({
      baseURL: `https://${process.env.YELP_URI}`,
      headers: {'Authorization': 'Bearer '+ process.env.YELP_KEY},
    });
  };

  const getBusinessesReviews = (businessIds) => {
    return Promise.all(businessIds.map((businessId) => {
      return getBusinessReviews(businessId).then((response) => {
        const reviews = (response.data &&
                        response.data.reviews) ?
                        response.data.reviews : {};
        return {
          businessId,
          reviews,
        };
      });
    }));
  };

  const getBusinessReviews = (businessId) => {
    const request = createRequest();
    const requestUrl = `/businesses/${businessId}/reviews`;
    request.id = businessId;
    return request.get(requestUrl);
  };

  const top5 = async () => {
    const request = createRequest();
    const requestUrl =
      `/businesses/search?` +
      `location=Alpharetta&categories=icecream&sort_by=rating&limit=5`;
    const response = await request.get(requestUrl);
    const businesses = response.data.businesses;

    const businessesIds = businesses.map((business) => {
      return business.id;
    });

    const businessesReviews = await getBusinessesReviews(businessesIds);
    //  Map required data from only one review
    const businessesReview = businessesReviews.map((businessReviews) => {
      if (!businessReviews.reviews.length);
      const review = businessReviews.reviews[0];
      return {
        businessId: businessReviews.businessId,
        text: review.text,
        name: review.user.name,
      };
    });

    return businesses.map((business) => {
      // eslint-disable-next-line no-unused-vars
      const {businessId, ...review} = businessesReview.find(
          (review) => business.id === review.businessId,
      );

      return {
        businessName: business.name,
        businessAddress:
          `${business.location.address1} - ${business.location.city}`,
        review,
      };
    });
  };

  return {
    top5,
  };
};

