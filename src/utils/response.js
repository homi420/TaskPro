const response = (status, resp) => {
  if (status === 500)
    return new Response(JSON.stringify({ resp: "Internal server error!" }), {
      status,
    });
  else return new Response(JSON.stringify({ resp }), { status });
};
export default response;
